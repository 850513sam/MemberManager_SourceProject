import { _decorator, Component, Button, Label } from 'cc';
import StorageHelper, { StoragePath } from '../Game/Helper/StorageHelper';
import { CourtInfoManager } from './CourtInfoManager';
import { Data, EPlayerType, PlayerInfo } from './Data';
import { PlayerInfoManager } from './PlayerInfoManager';
import { PlayerListManager } from './PlayerListManager';
import { EMsgCode, TipsManager } from './TipsManager';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component 
{
    @property
    private version: string = "";
    @property(Label)
    private versionLabel: Label = null;

    @property(Button)
    private btnAddPlayer: Button = null;
    @property(Button)
    private btnPlayerList: Button = null;

    @property(Button)
    private btnSetCourt_1: Button = null;
    @property(Button)
    private btnSetCourt_2: Button = null;

    @property(Button)
    private btnSave: Button = null;
    @property(Button)
    private btnClear: Button = null;

    @property(Label)
    private court_1_name: Label = null;
    @property(Label)
    private court_1_a1: Label = null;
    @property(Label)
    private court_1_a2: Label = null;
    @property(Label)
    private court_1_b1: Label = null;
    @property(Label)
    private court_1_b2: Label = null;

    @property(Label)
    private court_2_name: Label = null;
    @property(Label)
    private court_2_a1: Label = null;
    @property(Label)
    private court_2_a2: Label = null;
    @property(Label)
    private court_2_b1: Label = null;
    @property(Label)
    private court_2_b2: Label = null;

    private static instance: MainUI = null;
    public static getInstance(): MainUI
    {
        return MainUI.instance;
    }
    
    protected start() 
    {
        MainUI.instance = this;
        this.addBtnEvent();
        this.versionLabel.string = this.version;
        setTimeout(() => 
        {
            this.autoLoadPlayerData();
        }, 200);
    }

    private addBtnEvent()
    {
        this.btnAddPlayer.node.on(Button.EventType.CLICK, this.onBtnAddPlayer.bind(this));
        this.btnPlayerList.node.on(Button.EventType.CLICK, this.onBtnPlayerList.bind(this));
        this.btnSave.node.on(Button.EventType.CLICK, this.onBtnSave.bind(this));
        this.btnClear.node.on(Button.EventType.CLICK, this.onBtnClear.bind(this));
        this.btnSetCourt_1.node.on(Button.EventType.CLICK, () => { this.onBtnSetCourt(0); });
        this.btnSetCourt_2.node.on(Button.EventType.CLICK, () => { this.onBtnSetCourt(1); });
    }

    private autoLoadPlayerData()
    {
        const playerSetting = StorageHelper.loadFromLocal(StoragePath.PlayerSetting);
        let localPlayerList: PlayerInfo[] = [];
        if (!localPlayerList || !playerSetting)
        {
            return;
        }
        if (playerSetting)
        {
            localPlayerList = StorageHelper.loadFromLocal(StoragePath.PlayerSetting).playerList;
        }
        localPlayerList.forEach((playerInfo: PlayerInfo) => 
        {
            this.initPlayerData(playerInfo);
            Data.playerInfoList.push(playerInfo);
            PlayerListManager.getInstance().addPlayerItem();
        });
        TipsManager.getInstance().open(EMsgCode.FIND_DATA);
    }

    private initPlayerData(playerInfo: PlayerInfo)
    {
        playerInfo.completeMatchCount = 0;
        playerInfo.isChoose = false;
        playerInfo.isPlaying = false;
    }

    private onBtnAddPlayer()
    {
        PlayerInfoManager.getInstance().open();
    }
    
    private onBtnPlayerList()
    {
        PlayerListManager.getInstance().open(false);
    }

    private onBtnSave()
    {
        const needToSavePlayerList: PlayerInfo[] = [];
        Data.playerInfoList.forEach((playerInfo: PlayerInfo) => 
        {
            if (playerInfo.type != EPlayerType.DEFAULT)
            {
                needToSavePlayerList.push(playerInfo);
            }
        });
        const playerSetting = 
        {
            playerList: needToSavePlayerList,
        };
        StorageHelper.saveToLocal(StoragePath.PlayerSetting, playerSetting);
        TipsManager.getInstance().open(EMsgCode.SAVE_SUCCESSFUL);
    }

    private onBtnClear()
    {
        StorageHelper.clearLocal();
        TipsManager.getInstance().open(EMsgCode.CLEAR_SUCCESSFUL);
    }
    
    private onBtnSetCourt(courtIndex: number)
    {
        CourtInfoManager.getInstance().open(courtIndex);
    }

    public updateCourtInfo(courtIndex: number)
    {
        if (courtIndex == 0) 
        {
            this.court_1_name.string = Data.courtInfoList[courtIndex].courtName;
            this.court_1_a1.string = Data.courtInfoList[courtIndex].teamA[0].name;
            this.court_1_a2.string = Data.courtInfoList[courtIndex].teamA[1].name;
            this.court_1_b1.string = Data.courtInfoList[courtIndex].teamB[0].name;
            this.court_1_b2.string = Data.courtInfoList[courtIndex].teamB[1].name;
        }
        
        if (courtIndex == 1) 
        {
            this.court_2_name.string = Data.courtInfoList[courtIndex].courtName;
            this.court_2_a1.string = Data.courtInfoList[courtIndex].teamA[0].name;
            this.court_2_a2.string = Data.courtInfoList[courtIndex].teamA[1].name;
            this.court_2_b1.string = Data.courtInfoList[courtIndex].teamB[0].name;
            this.court_2_b2.string = Data.courtInfoList[courtIndex].teamB[1].name;
        }
    }
}
