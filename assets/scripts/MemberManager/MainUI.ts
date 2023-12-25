import { _decorator, Component, Button, Label } from 'cc';
import { CourtInfoManager } from './CourtInfoManager';
import { Data } from './Data';
import { PlayerInfoManager } from './PlayerInfoManager';
import { PlayerListManager } from './PlayerListManager';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component 
{
    @property(Button)
    private btnAddPlayer: Button = null;
    @property(Button)
    private btnPlayerList: Button = null;
    @property(Button)
    private btnSetCourt_1: Button = null;
    @property(Button)
    private btnSetCourt_2: Button = null;

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
    }

    private addBtnEvent()
    {
        this.btnAddPlayer.node.on(Button.EventType.CLICK, this.onBtnAddPlayer.bind(this));
        this.btnPlayerList.node.on(Button.EventType.CLICK, this.onBtnPlayerList.bind(this));
        this.btnSetCourt_1.node.on(Button.EventType.CLICK, () => { this.onBtnSetCourt(0); });
        this.btnSetCourt_2.node.on(Button.EventType.CLICK, () => { this.onBtnSetCourt(1); });
    }

    private onBtnAddPlayer()
    {
        PlayerInfoManager.getInstance().open();
    }
    
    private onBtnPlayerList()
    {
        PlayerListManager.getInstance().open(false);        
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
            this.court_1_a1.string = Data.courtInfoList[courtIndex].teamA[0].playerName;
            this.court_1_a2.string = Data.courtInfoList[courtIndex].teamA[1].playerName;
            this.court_1_b1.string = Data.courtInfoList[courtIndex].teamB[0].playerName;
            this.court_1_b2.string = Data.courtInfoList[courtIndex].teamB[1].playerName;
        }
        
        if (courtIndex == 1) 
        {
            this.court_2_name.string = Data.courtInfoList[courtIndex].courtName;
            this.court_2_a1.string = Data.courtInfoList[courtIndex].teamA[0].playerName;
            this.court_2_a2.string = Data.courtInfoList[courtIndex].teamA[1].playerName;
            this.court_2_b1.string = Data.courtInfoList[courtIndex].teamB[0].playerName;
            this.court_2_b2.string = Data.courtInfoList[courtIndex].teamB[1].playerName;
        }
    }
}
