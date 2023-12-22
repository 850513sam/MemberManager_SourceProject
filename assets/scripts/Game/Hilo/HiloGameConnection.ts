import { _decorator } from "cc";
import Application from "../../Application/Application";
import { PathName } from "../../Data/Config/path.config";
import { BetRequestData, BetResponseData } from "../../Data/DTO/Bet.dto";
import { CashoutResponseData, SkipResponseData } from "../../Data/DTO/Game.dto";
import { HiloGameData } from "./HiloGameData";
import { HiloGameView } from "./HiloGameView";
import { GameState, HiloGameLogic, PlayerOperateType } from "./HiloGameLogic";
import { PlayerInfo } from "../PlayerInfo";
import { GameEventType, StartUp } from "../StartUp";
import { ResultData } from "../GameObject/Provability";


const { ccclass } = _decorator;
@ccclass('HiloGameConnection')
export class HiloGameConnection
{
    private static instance: HiloGameConnection = null;
    public static getInstance(): HiloGameConnection 
    {
        if (!HiloGameConnection.instance)
        {
            HiloGameConnection.instance = new HiloGameConnection();
        }
        return HiloGameConnection.instance;
    }

    public init()
    {
        Application.Instance.connection.listenForPublishData(PathName.Skip, this.handleSkip.bind(this));
        Application.Instance.connection.listenForPublishData(PathName.Bet, this.handleBet.bind(this));
        Application.Instance.connection.listenForPublishData(PathName.Cashout, this.handleCashOut.bind(this));
    }

    public sendBet(betInfo: BetRequestData): Promise<BetResponseData>
    {
        // console.log("send bet");
        betInfo.Bet = HiloGameData.getInstance().getBetIndex();
        return Application.Instance.connection.send(PathName.Bet, betInfo);
    }

    private handleBet(event: BetResponseData)
    {
        // console.log("handle bet");
        if (HiloGameData.getInstance().getIsNewRound())
        {
            HiloGameData.getInstance().setIsNewRound(false);
        }
        HiloGameData.getInstance().setCurrentOdds(event.Multiplier);
        HiloGameData.getInstance().setCardIndex(event.Card);
        const data: any = Object.entries(event.Probability);
        HiloGameData.getInstance().setProbabilityList(data);
        const operate: PlayerOperateType = HiloGameLogic.getInstance().getPlayerOperateTypeFromWager(event.Wager);
        HiloGameView.getInstance().getNewCard(operate, event.Multiplier <= 0);
        this.setProveData(event);
    }

    public sendSkip(): Promise<SkipResponseData>
    {
        // console.log("send skip");
        return Application.Instance.connection.send(PathName.Skip, null);
    }

    private handleSkip(event: SkipResponseData)
    {
        // console.log("handle skip");
        const data: any = Object.entries(event.Probability);
        HiloGameData.getInstance().setProbabilityList(data);
        HiloGameData.getInstance().setCardIndex(event.Card);
        if (HiloGameLogic.getInstance().getGameState() != GameState.GAME_STATE_INIT)
        {
            HiloGameView.getInstance().getNewCard(PlayerOperateType.SKIP);
        }
        this.setProveData(event);
    }

    public sendCashOut(): Promise<CashoutResponseData>
    {
        // console.log("send cash out");
        return Application.Instance.connection.send(PathName.Cashout, null);
    }

    private handleCashOut(event: CashoutResponseData)
    {
        // console.log("handle cash out");
        HiloGameData.getInstance().setIsWin(event.TotalWin > 0);
        PlayerInfo.getInstance().setPlayerMoney(event.Balance);
        HiloGameLogic.getInstance().setGameState(GameState.GAME_STATE_RESULT);
    }

    private setProveData(event: any)
    {
        HiloGameData.getInstance().setNextHash(event.NextHash)
        StartUp.getInstance().node.emit(GameEventType.NEXT_HASH, event.NextHash);
        if (!HiloGameData.getInstance().getIsFirstIntoGame())
        {
            const provabilityData: ResultData = new ResultData();
            provabilityData.Card = event.Card;
            provabilityData.Secret = event.Secret;
            StartUp.getInstance().node.emit(GameEventType.RESULT, provabilityData);
        }
        HiloGameData.getInstance().setIsFirstIntoGame(false);
    }
}
