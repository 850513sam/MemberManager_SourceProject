import { Button } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";
import { Sprite } from "cc";
import { SpriteAtlas } from "cc";
import { HiloScoreManager } from "./HiloScoreManager";
import NumberFormatter from "../../../Toolkit/Components/NumberFormatter";
import { StartUp } from "../../StartUp";
import { HiloGameConnection } from "../HiloGameConnection";
import { BetRequestData } from "../../../Data/DTO/Bet.dto";
import { HiloGameData } from "../HiloGameData";
import { PlayerInfo } from "../../PlayerInfo";
import { GameState, HiloGameLogic } from "../HiloGameLogic";
import { HiloBetSettingManager } from "../BetSetting/HiloBetSettingManager";
import { HiloPokerTool } from "../HiloPokerTool";
import Application from "../../../Application/Application";

const { ccclass, property } = _decorator;
@ccclass('HiloButtonManager')
export class HiloButtonManager extends Component 
{
    //system btn
    @property(Button)
    private btnClose: Button = null;
    //game btn
    @property(Button)
    private btnRefresh: Button = null;
    @property(Button)
    private btnHigh: Button = null;
    @property(Button)
    private btnLow: Button = null;
    @property(Button)
    private btnCashOut: Button = null;
    @property(Button)
    private btnNextRound: Button = null;
    @property(Button)
    private btnBet: Button = null;
    @property(Button)
    private btnBetList: Button = null;
    @property(SpriteAtlas)
    private betAtlas: SpriteAtlas = null;
    @property(NumberFormatter)
    private currentBetTxt: NumberFormatter = null;

    private betBtnSpriteName: string[] = ["btn_equal", "btn_largerthan", "btn_lessthan", "btn_equalandlargethan", "btn_equalandlessthan"];

    private static instance: HiloButtonManager = null;
    public static getInstance(): HiloButtonManager 
    {
        return HiloButtonManager.instance;
    }
   
    public init()
    {
        this.addBtnEvent();
        this.updateCurrentBetValue();
    }
    
    protected start() 
    {
        if (Application.Instance.config.hideExit) {
            this.btnClose.node.active = false;
        }
        HiloButtonManager.instance = this;
    }

    private addBtnEvent()
    {
        this.btnRefresh.node.on(Button.EventType.CLICK, this.onBtnRefresh.bind(this));
        this.btnHigh.node.on(Button.EventType.CLICK, () =>
        {
            this.onBtnBet(0);
        });
        this.btnLow.node.on(Button.EventType.CLICK, () =>
        {
            this.onBtnBet(1);
        });
        this.btnCashOut.node.on(Button.EventType.CLICK, this.onBtnCashOut.bind(this));
        this.btnNextRound.node.on(Button.EventType.CLICK, this.onBtnNextRound.bind(this));
        this.btnBet.node.on(Button.EventType.CLICK, this.onBtnStartBet.bind(this));
        this.btnBetList.node.on(Button.EventType.CLICK, this.onBtnBetList.bind(this));
        this.btnClose.node.on(Button.EventType.CLICK, this.onBtnClose.bind(this));
    }

    private onBtnClose()
    {
        StartUp.getInstance().closeGame();
    }

    private onBtnRefresh()
    {
        this.setRefreshBtnLock(false);
        this.setBetLock(false);
        this.setCompareBtnLock(false);
        HiloGameConnection.getInstance().sendSkip();
    }

    private onBtnBet(betType: number)
    {
        this.setRefreshBtnLock(false);
        this.setCompareBtnLock(false);
        this.btnCashOut.interactable = false;
        const betInfo: BetRequestData = new BetRequestData();
        betInfo.Wager = HiloGameData.getInstance().getBetIndexList()[betType];
        HiloGameConnection.getInstance().sendBet(betInfo);
    }

    private onBtnStartBet()
    {
        const gameData: HiloGameData = HiloGameData.getInstance();
        const playerInfo: PlayerInfo = PlayerInfo.getInstance();
        const betValue: number = gameData.getCurrentBetValue();
        const tmpMoney: number = playerInfo.getPlayerMoney() - betValue;
        const money: number = tmpMoney * playerInfo.getDenom();
        if (money < 0)
        {
            Application.Instance.connection.onMoneyNotEnough();
            return;
        }
        playerInfo.setPlayerMoney(money);
        HiloGameLogic.getInstance().setGameState(GameState.GAME_STATE_BET);
    }
    
    private onBtnCashOut()
    {
        this.setRefreshBtnLock(false);
        this.setBetLock(false);
        this.setCompareBtnLock(false);
        HiloGameData.getInstance().setIsWin(true);
        HiloGameConnection.getInstance().sendCashOut();
    }
    
    private onBtnNextRound()
    {
        HiloGameLogic.getInstance().setGameState(GameState.GAME_STATE_START);
    }
    
    private onBtnBetList()
    {
        HiloBetSettingManager.getInstance().openBetSetting();
    }

    public setBetLock(enable: boolean)
    {
        this.btnBet.interactable = enable;
        this.btnCashOut.interactable = enable;
        this.btnNextRound.interactable = enable;
    }

    public setCompareBtnLock(enable: boolean)
    {
        this.btnHigh.interactable = enable;
        this.btnLow.interactable = enable;
    }

    public setRefreshBtnLock(enable: boolean)
    {
        this.btnRefresh.interactable = enable;
    }

    public updateCompareBtnState()
    {
        const cardIndex: number = HiloGameData.getInstance().getCardIndex();
        const cardValue: number = HiloPokerTool.getInstance().getPokerValue(cardIndex);
        const betIndexList: Array<number> = new Array<number>();
        let highBetIndex: number = 0;
        let lowBetIndex: number = 0;
        switch (cardValue)
        {
            case 1:
                this.btnHigh.node.getComponent(Sprite).spriteFrame = this.betAtlas.getSpriteFrame(this.betBtnSpriteName[1]);
                this.btnLow.node.getComponent(Sprite).spriteFrame = this.betAtlas.getSpriteFrame(this.betBtnSpriteName[0]);                
                highBetIndex = 5;
                lowBetIndex = 3;
                break;
            case 13:
                this.btnHigh.node.getComponent(Sprite).spriteFrame = this.betAtlas.getSpriteFrame(this.betBtnSpriteName[0]);
                this.btnLow.node.getComponent(Sprite).spriteFrame = this.betAtlas.getSpriteFrame(this.betBtnSpriteName[2]);
                highBetIndex = 3;
                lowBetIndex = 1;
                break;
            default:
                this.btnHigh.node.getComponent(Sprite).spriteFrame = this.betAtlas.getSpriteFrame(this.betBtnSpriteName[3]);
                this.btnLow.node.getComponent(Sprite).spriteFrame = this.betAtlas.getSpriteFrame(this.betBtnSpriteName[4]);
                highBetIndex = 4;
                lowBetIndex = 2;
                break;
        }
        betIndexList.push(highBetIndex);
        betIndexList.push(lowBetIndex);
        HiloGameData.getInstance().setBetIndexList(betIndexList);
    }

    public updateBetBtnState(isLose: boolean = false)
    {
        const gameState: GameState = HiloGameLogic.getInstance().getGameState();
        const isStartState: boolean = gameState == GameState.GAME_STATE_START;
        const isBetState: boolean = gameState == GameState.GAME_STATE_BET;
        const isResultState: boolean = gameState == GameState.GAME_STATE_RESULT;
        const isFirstRound: boolean = HiloGameData.getInstance().getIsNewRound();
        this.btnBet.node.active = isStartState;
        this.btnCashOut.node.active = isBetState && !isFirstRound;
        this.btnNextRound.node.active = isResultState;
        this.btnBetList.interactable = isStartState;
        this.setCompareBtnLock(isBetState);
        this.setBetLock(true);
        this.setRefreshBtnLock(isStartState || isBetState);

        //避免延遲過高導致ui狀態異常
        if (isLose)
        {
            this.setCompareBtnLock(false);
            this.setBetLock(false);
            this.setRefreshBtnLock(false);
        }
    }

    public updateCurrentBetValue()
    {
        const currentBet: number = HiloGameData.getInstance().getCurrentBetValue();
        this.currentBetTxt.value = currentBet;
        HiloScoreManager.getInstance().updateScoreInfo(false);
    }
}
