import { tween, _decorator } from "cc";
import { HiloGameView } from "./HiloGameView";
import { input } from "cc";
import { Input } from "cc";
import { KeyCode } from "cc";
import I18n from "../../I18n/I18n";
import { SupportLanguage } from "../../I18n/Config/support.config";
import { HiloRoadMapManager } from "./RoadMap/HiloRoadMapManager";
import { HiloGameData } from "./HiloGameData";
import { HiloScoreManager } from "./UI/HiloScoreManager";
import Application from "../../Application/Application";
import { EnterTableResponseData } from "../../Data/DTO/Table.dto";
import { HiloGameConnection } from "./HiloGameConnection";
import { BetRequestData } from "../../Data/DTO/Bet.dto";
import {  DebugRequestData } from "../../Data/DTO/Debug.dto";
import { HiloResultManager } from "./UI/HiloResultManager";
import { HiloPokerTool } from "./HiloPokerTool";
import { HiloButtonManager } from "./UI/HiloButtonManager";

const { ccclass } = _decorator;

export enum GameState
{
    DEFAULT = -1,
    GAME_STATE_INIT = 0,
    GAME_STATE_START = 1,
    GAME_STATE_BET = 2,
    GAME_STATE_RESULT = 3,
}

export enum PlayerOperateType
{
    DEFAULT = -1,
    HIGH = 0,
    LOW = 1,
    SKIP = 2,
}

@ccclass('HiloGameLogic')
export class HiloGameLogic
{
    private gameState: GameState = GameState.DEFAULT;
    private gameData: HiloGameData = HiloGameData.getInstance();

    private static instance: HiloGameLogic = null;
    public static getInstance(): HiloGameLogic 
    {
        if (!HiloGameLogic.instance)
        {
            HiloGameLogic.instance = new HiloGameLogic();
        }
        return HiloGameLogic.instance;
    }
    
    public init(event: EnterTableResponseData)
    {
        this.addTestEvent();
        this.initOddsList(Object.entries(event.PayTable));
        this.gameData.setBetList(event.Bets.Values);
        this.gameData.setDefaultBetIndex(event.Bets.Default);
        this.gameData.setBetIndex(event.Bets.Default);
        this.gameData.setCurrentBetValue(event.Bets.Values[this.gameData.getDefaultBetIndex()]);
        HiloGameLogic.getInstance().setGameState(GameState.GAME_STATE_INIT);
    }

    private initOddsList(payTableData: any)
    {
        let oddsList: Array<Array<number>> = new Array<Array<number>>();
        let oddsList1: Array<number> = new Array<number>();
        let oddsList2: Array<number> = new Array<number>();
        let odds1: number = 0;
        let odds2: number = 0;
        let oddsKey1: string = "";
        let oddsKey2: string = "";
        for (let i: number = 0; i < payTableData.length; i++)
        {
            if (i == 0)
            {
                oddsKey1 = "equal";
                oddsKey2 = "greater";
            }
            else if (i == payTableData.length - 1)
            {
                oddsKey1 = "less";
                oddsKey2 = "equal";
            }
            else
            {
                oddsKey1 = "greaterEqual";
                oddsKey2 = "lessEqual";
            }
            
            odds1 = payTableData[i][1][oddsKey1];
            odds2 = payTableData[i][1][oddsKey2];
            oddsList1.push(odds1);
            oddsList2.push(odds2);
        }
        oddsList.push(oddsList1);
        oddsList.push(oddsList2);
        this.gameData.setOddsList(oddsList);
    }

    public getGameState(): GameState
    {
        return this.gameState;
    }

    public setGameState(gameState: GameState)
    {
        this.gameState = gameState;
        this.onGameStateChange();
    }

    private onGameStateChange()
    {
        switch (this.gameState) 
        {
            case GameState.GAME_STATE_INIT:
                this.onGameInit();
                break;
            case GameState.GAME_STATE_START:
                this.onGameStart();
                break;
            case GameState.GAME_STATE_BET:
                this.onGameBet();
                break;
            case GameState.GAME_STATE_RESULT:
                this.onGameResult();
                break;
        }
    }

    private onGameInit()
    {
        // console.log("state : init");
        console.log("prepare start game");
    }

    private onGameStart()
    {
        // console.log("state : start");
        HiloGameView.getInstance().updateCurrentCardInfo();
        this.gameData.setIsNewRound(true);
        this.gameData.setIsWin(true);
        HiloButtonManager.getInstance().updateBetBtnState();
        HiloButtonManager.getInstance().setRefreshBtnLock(true);
        HiloButtonManager.getInstance().setCompareBtnLock(false);
        this.gameData.setCurrentOdds(100);
        HiloScoreManager.getInstance().updateScoreInfo(false);
        HiloRoadMapManager.getInstance().refreshRecord();
        HiloGameView.getInstance().updateLossEffect();
    }

    private onGameBet()
    {
        // console.log("state : bet");
        HiloButtonManager.getInstance().updateBetBtnState();
        HiloButtonManager.getInstance().setCompareBtnLock(true);
        HiloScoreManager.getInstance().updateScoreInfo(true);
    }

    private onGameResult()
    {
        // console.log("state : result");
        tween(this).delay(1.2).call(() => 
        {
            HiloButtonManager.getInstance().updateBetBtnState();
        }).start();
        HiloResultManager.getInstance().openResultPage();
    }

    public closeGame()
    {
        if (Application.Instance.config.homeURL) 
        {
            document.location.href = Application.Instance.config.homeURL;
        } 
        else 
        {
            window.close();
            window.history.back();
        }
    }

    public getPlayerOperateTypeFromWager(wager: number): PlayerOperateType
    {
        let operateType: PlayerOperateType = PlayerOperateType.DEFAULT;
        switch (wager)
        {
            case 1:
            case 2:
                operateType = PlayerOperateType.LOW;
                break;
            case 3:
                let cardIndex: number = this.gameData.getCardIndex();
                let cardValue: number = HiloPokerTool.getInstance().getPokerValue(cardIndex);
                operateType = cardValue == 1 ? PlayerOperateType.LOW : PlayerOperateType.HIGH;
                break;
            case 4:
            case 5:
                operateType = PlayerOperateType.HIGH;
                break;
        }
        return operateType;
    }
    
    private addTestEvent()
    {
        let isDebugWin: boolean = true;
        let betInfo: BetRequestData = new BetRequestData();
        let debugInfo: DebugRequestData = new DebugRequestData();
        let wagerIndex: number = 1;
        let winOrLossStr: string = "";
        let wagerStr: string = "";
        debugInfo.Win = isDebugWin;
        winOrLossStr = debugInfo.Win ? "贏" : "輸";
        betInfo.Debug = debugInfo;
        betInfo.Wager = 1;

        if (Application.Instance.config.debug) 
        {
            input.on(Input.EventType.KEY_UP, async (event) => 
            {
                switch (event.keyCode) 
                {
                    case KeyCode.SPACE:
                        isDebugWin = !isDebugWin;
                        debugInfo.Win = isDebugWin;
                        winOrLossStr = debugInfo.Win ? "贏" : "輸";
                        console.log(`切換輸贏模式 : ${winOrLossStr}`);
                        break;

                    case KeyCode.ARROW_UP:
                        debugInfo.Mode = 1;
                        betInfo.Wager = HiloGameData.getInstance().getBetIndexList()[0];
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`自動下注上方按鈕 , 當前輸贏結果 : ${winOrLossStr}`);
                        break;
                    case KeyCode.ARROW_DOWN:
                        debugInfo.Mode = 1;
                        betInfo.Wager = HiloGameData.getInstance().getBetIndexList()[1];
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`自動下注下方按鈕 , 當前輸贏結果 : ${winOrLossStr}`);
                        break;
                    case KeyCode.DIGIT_1:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 1;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_2:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 2;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_3:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 3;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_4:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 4;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_5:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 5;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_6:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 6;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_7:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 7;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_8:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 8;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_9:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 9;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.DIGIT_0:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 10;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.KEY_Q:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 11;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.KEY_W:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 12;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.KEY_E:
                        debugInfo.Mode = 2;
                        debugInfo.Rank = 13;
                        HiloGameConnection.getInstance().sendBet(betInfo);
                        console.log(`指定牌面結果 : ${debugInfo.Rank} , 當前下注模式 : ${wagerStr}`);
                        break;

                    case KeyCode.KEY_Z:
                        betInfo.Wager = 1;
                        wagerStr = "小於";
                        console.log(`切換下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.KEY_X:
                        betInfo.Wager = 2;
                        wagerStr = "小於等於";
                        console.log(`切換下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.KEY_C:
                        betInfo.Wager = 3;
                        wagerStr = "等於";
                        console.log(`切換下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.KEY_V:
                        betInfo.Wager = 4;
                        wagerStr = "大於等於";
                        console.log(`切換下注模式 : ${wagerStr}`);
                        break;
                    case KeyCode.KEY_B:
                        betInfo.Wager = 5;
                        wagerStr = "大於";
                        console.log(`切換下注模式 : ${wagerStr}`);
                        break;

                    case KeyCode.F1:
                        I18n.Instance.changeLanguage(SupportLanguage.EN);
                        break;
                    case KeyCode.F2:
                        I18n.Instance.changeLanguage(SupportLanguage.SCH);
                        break;
                    case KeyCode.F3:
                        I18n.Instance.changeLanguage(SupportLanguage.TCH);
                        break;
                    case KeyCode.F4:
                        I18n.Instance.changeLanguage(SupportLanguage.VI);
                        break;
                    case KeyCode.F5:
                        I18n.Instance.changeLanguage(SupportLanguage.JA);
                        break;
                    case KeyCode.F6:
                        I18n.Instance.changeLanguage(SupportLanguage.PT);
                        break;
                    case KeyCode.F7:
                        I18n.Instance.changeLanguage(SupportLanguage.ES);
                        break;
                    case KeyCode.F8:
                        I18n.Instance.changeLanguage(SupportLanguage.KO);
                        break;
                    case KeyCode.F9:
                        I18n.Instance.changeLanguage(SupportLanguage.ID);
                        break;
                    case KeyCode.F10:
                        I18n.Instance.changeLanguage(SupportLanguage.TH);
                        break;
                    default:
                        break;
                }
            });
        }
    }
}
