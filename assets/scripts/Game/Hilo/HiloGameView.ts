import { UIOpacity } from "cc";
import { SpriteAtlas } from "cc";
import { Node } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";
import { HiloGameData } from "./HiloGameData";
import { tween } from "cc";
import { Vec3 } from "cc";
import { HiloPokerTool } from "./HiloPokerTool";
import { GameState, HiloGameLogic, PlayerOperateType } from "./HiloGameLogic";
import { HiloRoadMapManager } from "./RoadMap/HiloRoadMapManager";
import { HiloScoreManager } from "./UI/HiloScoreManager";
import { PlayerInfo } from "../PlayerInfo";
import NumberFormatter from "../../Toolkit/Components/NumberFormatter";
import { HiloResultManager } from "./UI/HiloResultManager";
import { HiloBetSettingManager } from "./BetSetting/HiloBetSettingManager";
import { HiloButtonManager } from "./UI/HiloButtonManager";
import { HiloOddsInfoManager } from "./UI/HiloOddsInfoManager";
import { HiloProbabilityInfoManager } from "./UI/HiloProbabilityInfoManager";
import AudioManager from "../AudioManager";
import { SoundEffect as SoundEffect } from "../Config/audio.config";
import { Label } from "cc";
import { defaultAppConfig } from "../../Data/Config/app.config";

const { ccclass, property } = _decorator;
@ccclass('HiloGameView')
export class HiloGameView extends Component 
{
    @property(Node)
    private currentCard: Node = null;
    @property(Node)
    private abandonCard: Node = null;
    @property(Node)
    private lossEffect: Node = null;
    @property(SpriteAtlas)
    private pokerAtlas: SpriteAtlas = null;
    @property(NumberFormatter)
    private playerMoneyTxt: NumberFormatter = null;
    @property(Label)
    private versionTxt: Label = null;

    private static instance: HiloGameView = null;
    public static getInstance(): HiloGameView 
    {
        return HiloGameView.instance;
    }
    
    protected start() 
    {
        HiloGameView.instance = this;
        this.init();
    }
    
    public init()
    {
        this.checkGameSceneIsLoadFinish();
        this.updatePlayerMoney();
        this.lossEffect.active = false;
    }

    private checkGameSceneIsLoadFinish()
    {
        const betSettingManager: HiloBetSettingManager = HiloBetSettingManager.getInstance();
        const buttongManager: HiloButtonManager = HiloButtonManager.getInstance();
        const oddsInfoManager: HiloOddsInfoManager = HiloOddsInfoManager.getInstance();
        const probabilityInfoManager: HiloProbabilityInfoManager = HiloProbabilityInfoManager.getInstance();
        const roadMapManager: HiloRoadMapManager = HiloRoadMapManager.getInstance();
        const scoreManager: HiloScoreManager = HiloScoreManager.getInstance();
        const resultManager: HiloResultManager = HiloResultManager.getInstance();
        const isConnect: boolean = HiloGameLogic.getInstance().getGameState() == GameState.GAME_STATE_INIT;

        if (!betSettingManager || 
            !buttongManager || 
            !oddsInfoManager || 
            !probabilityInfoManager || 
            !roadMapManager || 
            !scoreManager || 
            !resultManager || 
            !isConnect)
        {
            // console.log("something loading");
            this.waitLoading();
            return;
        }
        this.prepareStartGame();
        // console.log("loading finish");
    }

    private prepareStartGame()
    {
        HiloButtonManager.getInstance().init();
        HiloPokerTool.getInstance().setPokeAtlas(this.pokerAtlas);
        HiloBetSettingManager.getInstance().initBetSettingPage();
        HiloGameLogic.getInstance().setGameState(GameState.GAME_STATE_START);
        this.setGameVersion();
    }

    private waitLoading()
    {
        setTimeout(() => 
        {
            // console.log("loading...");
            this.checkGameSceneIsLoadFinish();
        }, 1000 / 60);
    }
    
    public getNewCard(operateType: PlayerOperateType, isLose: boolean = false)
    {
        HiloButtonManager.getInstance().setBetLock(false);
        HiloButtonManager.getInstance().setCompareBtnLock(false);
        HiloButtonManager.getInstance().setRefreshBtnLock(false);
        this.throwAbandonCard(operateType, isLose);
    }

    public updateCurrentCardInfo() 
    {
        const cardIndex: number = HiloGameData.getInstance().getCardIndex();
        tween(this.node).delay(0.2).call(() => 
        {
            HiloPokerTool.getInstance().turnCardOver(this.currentCard, cardIndex);
        }).start();
        HiloProbabilityInfoManager.getInstance().updateProbabilityInfo();
        HiloOddsInfoManager.getInstance().updateOddsInfo();
        HiloButtonManager.getInstance().updateCompareBtnState();
        tween(this.node).delay(1).call(() => 
        {
            if (HiloGameLogic.getInstance().getGameState() == GameState.GAME_STATE_BET)
            {
                HiloScoreManager.getInstance().updateScoreInfo(true);
            }
        }).start();
        this.initAbandonCard();
    }

    private initAbandonCard()
    {
        const cardIndex: number = HiloGameData.getInstance().getCardIndex();
        this.abandonCard = HiloPokerTool.getInstance().getPoker(this.abandonCard, cardIndex);
        this.abandonCard.getComponent(UIOpacity).opacity = 0;
        this.abandonCard.position = new Vec3(0, 0);
        this.abandonCard.scale = new Vec3(1, 1);
        this.abandonCard.angle = 0;
    }

    private throwAbandonCard(operateType: PlayerOperateType, isLose: boolean)
    {
        AudioManager.Instance.playEffect(SoundEffect.MUCKED);
        const duration: number = 0.3;
        const abandonCardOpacity: UIOpacity = this.abandonCard.getComponent(UIOpacity);
        abandonCardOpacity.opacity = 255;
        this.currentCard = HiloPokerTool.getInstance().getPoker(this.currentCard, -1);
        tween(this.abandonCard).to(duration, { scale: new Vec3(0, 0), angle: 45 }).start();
        tween(this.abandonCard).to(duration, { position: new Vec3(-400, 500) }).start();
        tween(abandonCardOpacity).to(duration, { opacity: 0}).call(() => 
        {
            this.updateCurrentCardInfo();
            if (HiloGameLogic.getInstance().getGameState() == GameState.GAME_STATE_START) 
            {
                HiloRoadMapManager.getInstance().refreshRecord();
            }
            else
            {
                HiloRoadMapManager.getInstance().addRecord(operateType, false);
            }
        }).delay(0.85)
        .call(() => 
        {
            this.updateLossEffect();
            HiloButtonManager.getInstance().updateBetBtnState(isLose);
        }).start();
    }

    public updatePlayerMoney()
    {
        this.playerMoneyTxt.value = PlayerInfo.getInstance().getPlayerMoney();
    }

    public updateLossEffect()
    {
        this.lossEffect.active = !HiloGameData.getInstance().getIsWin();
    }

    private setGameVersion()
    {
        this.versionTxt.string = defaultAppConfig.GameVersion;
    }
}
