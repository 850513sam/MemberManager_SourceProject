import { _decorator, Component, Button, EditBox, Label } from 'cc';
import { CourtInfo, Data, PlayerInfo } from './Data';
import { MainUI } from './MainUI';
import { MatchManager } from './MatchManager';
import { PlayerListManager } from './PlayerListManager';
const { ccclass, property } = _decorator;

@ccclass('CourtInfoManager')
export class CourtInfoManager extends Component 
{
    @property(Button)
    private btnClose: Button = null;
    @property(EditBox)
    private courtName: EditBox = null;

    @property(Button)
    private btnPlayer_a1: Button = null;
    @property(Button)
    private btnPlayer_a2: Button = null;
    @property(Button)
    private btnPlayer_b1: Button = null;
    @property(Button)
    private btnPlayer_b2: Button = null;

    @property(Label)
    private playerName_a1: Label = null;
    @property(Label)
    private playerName_a2: Label = null;
    @property(Label)
    private playerName_b1: Label = null;
    @property(Label)
    private playerName_b2: Label = null;

    @property(Button)
    private btnClear_a1: Button = null;
    @property(Button)
    private btnClear_a2: Button = null;
    @property(Button)
    private btnClear_b1: Button = null;
    @property(Button)
    private btnClear_b2: Button = null;

    @property(Button)
    private btnStart: Button = null;
    @property(Button)
    private btnEnd: Button = null;
    @property(Button)
    private btnRefresh: Button = null;
    @property(Button)
    private btnSet: Button = null;
    @property(Label)
    private nextMatchInfo: Label = null;

    private editCourtIndex: number = -1;
    private editPlayerIndex: number = -1;
    private editBtnGroup: Button[] = [];
    private nextMatchPlayers: PlayerInfo[][] = [];

    private static instance: CourtInfoManager = null;
    public static getInstance(): CourtInfoManager
    {
        return CourtInfoManager.instance;
    }
    
    protected start() 
    {
        CourtInfoManager.instance = this;
        this.close();
        this.courtInfoInit();
        this.addBtnEvent();
        this.init();
    }

    private courtInfoInit()
    {
        for (let i = 0; i < 2; i++)
        {
            const courtInfo = new CourtInfo();
            const playerA1 = new PlayerInfo();
            const playerA2 = new PlayerInfo();
            const playerB1 = new PlayerInfo();
            const playerB2 = new PlayerInfo();

            courtInfo.courtName = `1-${i + 1}`;
            courtInfo.index = i;
            courtInfo.teamA.push(playerA1);
            courtInfo.teamA.push(playerA2);
            courtInfo.teamB.push(playerB1);
            courtInfo.teamB.push(playerB2);
            courtInfo.teamA[0] = playerA1;
            courtInfo.teamA[1] = playerA2;
            courtInfo.teamB[0] = playerB1;
            courtInfo.teamB[1] = playerB2;
            courtInfo.defaultTeamA.push(playerA1);
            courtInfo.defaultTeamA.push(playerA2);
            courtInfo.defaultTeamB.push(playerB1);
            courtInfo.defaultTeamB.push(playerB2);
            courtInfo.defaultTeamA[0] = playerA1;
            courtInfo.defaultTeamA[1] = playerA2;
            courtInfo.defaultTeamB[0] = playerB1;
            courtInfo.defaultTeamB[1] = playerB2;

            Data.courtInfoList.push(courtInfo);
        }
    }

    private addBtnEvent()
    {
        this.btnClose.node.on(Button.EventType.CLICK, this.onBtnClose.bind(this));
        this.btnStart.node.on(Button.EventType.CLICK, this.onBtnStart.bind(this));
        this.btnRefresh.node.on(Button.EventType.CLICK, this.onBtnRefresh.bind(this));
        this.btnEnd.node.on(Button.EventType.CLICK, this.onBtnEnd.bind(this));
        this.btnSet.node.on(Button.EventType.CLICK, this.onBtnSet.bind(this));
        this.btnPlayer_a1.node.on(Button.EventType.CLICK, () => { this.onBtnPlayer(0); });
        this.btnPlayer_a2.node.on(Button.EventType.CLICK, () => { this.onBtnPlayer(1); });
        this.btnPlayer_b1.node.on(Button.EventType.CLICK, () => { this.onBtnPlayer(2); });
        this.btnPlayer_b2.node.on(Button.EventType.CLICK, () => { this.onBtnPlayer(3); });
        this.btnClear_a1.node.on(Button.EventType.CLICK, () => { this.onBtnClear(0); });
        this.btnClear_a2.node.on(Button.EventType.CLICK, () => { this.onBtnClear(1); });
        this.btnClear_b1.node.on(Button.EventType.CLICK, () => { this.onBtnClear(2); });
        this.btnClear_b2.node.on(Button.EventType.CLICK, () => { this.onBtnClear(3); });
    }

    private onBtnClose()
    {
        this.close();
    }

    private onBtnStart()
    {
        this.btnStart.interactable = false;
        this.btnEnd.interactable = true;
        this.setEditBtnGroup(false);
        this.updatePlayerStatus(true);
        this.updateNextMatchInfo();
        MainUI.getInstance().updateCourtInfo(this.editCourtIndex);
        Data.courtInfoList[this.editCourtIndex].isPlaying = true;
    }

    private updateNextMatchInfo() 
    {
        this.nextMatchPlayers = MatchManager.getInstance().getNextMatchPlayers();
        const playerA1 = this.nextMatchPlayers[0][0].playerName;
        const playerA2 = this.nextMatchPlayers[0][1].playerName;
        const playerB1 = this.nextMatchPlayers[1][0].playerName;
        const playerB2 = this.nextMatchPlayers[1][1].playerName;
        this.nextMatchInfo.string = `${playerA1} + ${playerA2} vs ${playerB1} + ${playerB2}`;
        Data.courtInfoList[this.editCourtIndex].nextMatchInfo = this.nextMatchInfo.string;
    }

    private updatePlayerStatus(isPlaying: boolean) 
    {
        const courtInfo: CourtInfo = Data.courtInfoList[this.editCourtIndex];
        courtInfo.teamA[0].isPlaying = isPlaying;
        courtInfo.teamA[1].isPlaying = isPlaying;
        courtInfo.teamB[0].isPlaying = isPlaying;
        courtInfo.teamB[1].isPlaying = isPlaying;
    }

    private setEditBtnGroup(enable: boolean)
    {
        this.editBtnGroup.forEach((btn: Button) => 
        {
            btn.interactable = enable;
        });
    }

    private onBtnRefresh()
    {
        this.updateNextMatchInfo();
    }

    private onBtnEnd()
    {
        this.btnStart.interactable = true;
        this.btnEnd.interactable = false;
        this.setEditBtnGroup(true);
        this.updatePlayerStatus(false);
        Data.courtInfoList[this.editCourtIndex].isPlaying = false;
        Data.courtInfoList[this.editCourtIndex].teamA[0].completeMatchCount++;
        Data.courtInfoList[this.editCourtIndex].teamA[1].completeMatchCount++;
        Data.courtInfoList[this.editCourtIndex].teamB[0].completeMatchCount++;
        Data.courtInfoList[this.editCourtIndex].teamB[1].completeMatchCount++;
        Data.courtInfoList[this.editCourtIndex].teamA = Data.courtInfoList[this.editCourtIndex].defaultTeamA;
        Data.courtInfoList[this.editCourtIndex].teamB = Data.courtInfoList[this.editCourtIndex].defaultTeamB;
        MainUI.getInstance().updateCourtInfo(this.editCourtIndex);
        for (let i = 0; i < 4; i++)
        {
            this.onBtnClear(i);
        }
    }

    private onBtnSet()
    {
        this.editPlayerIndex = 0;
        this.setNewPlayer(this.nextMatchPlayers[0][0]);
        this.editPlayerIndex = 1;
        this.setNewPlayer(this.nextMatchPlayers[0][1]);
        this.editPlayerIndex = 2;
        this.setNewPlayer(this.nextMatchPlayers[1][0]);
        this.editPlayerIndex = 3;
        this.setNewPlayer(this.nextMatchPlayers[1][1]);
    }

    private onBtnPlayer(editPlayerIndex: number)
    {
        this.editPlayerIndex = editPlayerIndex;
        PlayerListManager.getInstance().open(true);
    }

    private onBtnClear(editPlayerIndex: number)
    {
        this.editPlayerIndex = editPlayerIndex;
        let defaultPlayer: PlayerInfo = null;
        switch (editPlayerIndex) 
        {
            case 0:
                defaultPlayer = Data.courtInfoList[this.editCourtIndex].defaultTeamA[0];
                break;
            case 1:
                defaultPlayer = Data.courtInfoList[this.editCourtIndex].defaultTeamA[1];
                break;
            case 2:
                defaultPlayer = Data.courtInfoList[this.editCourtIndex].defaultTeamB[0];
                break;
            case 3:
                defaultPlayer = Data.courtInfoList[this.editCourtIndex].defaultTeamB[1];
                break;
        }
        this.setNewPlayer(defaultPlayer);
    }

    public setNewPlayer(playerInfo: PlayerInfo)
    {
        switch (this.editPlayerIndex)
        {
            case 0:
                Data.courtInfoList[this.editCourtIndex].teamA[0].isPlaying = false;
                Data.courtInfoList[this.editCourtIndex].teamA[0] = playerInfo;
                this.playerName_a1.string = playerInfo.playerName;
                break;
            case 1:
                Data.courtInfoList[this.editCourtIndex].teamA[1].isPlaying = false;
                Data.courtInfoList[this.editCourtIndex].teamA[1] = playerInfo;
                this.playerName_a2.string = playerInfo.playerName;
                break;
            case 2:
                Data.courtInfoList[this.editCourtIndex].teamB[0].isPlaying = false;
                Data.courtInfoList[this.editCourtIndex].teamB[0] = playerInfo;
                this.playerName_b1.string = playerInfo.playerName;
                break;
            case 3:
                Data.courtInfoList[this.editCourtIndex].teamB[1].isPlaying = false;
                Data.courtInfoList[this.editCourtIndex].teamB[1] = playerInfo;
                this.playerName_b2.string = playerInfo.playerName;
                break;
        }
    }

    private init()
    {
        this.btnEnd.interactable = false;
        this.editBtnGroup.push(this.btnPlayer_a1);
        this.editBtnGroup.push(this.btnPlayer_a2);
        this.editBtnGroup.push(this.btnPlayer_b1);
        this.editBtnGroup.push(this.btnPlayer_b2);
        this.editBtnGroup.push(this.btnClear_a1);
        this.editBtnGroup.push(this.btnClear_a2);
        this.editBtnGroup.push(this.btnClear_b1);
        this.editBtnGroup.push(this.btnClear_b2);
        this.editBtnGroup.push(this.btnSet);
        MainUI.getInstance().updateCourtInfo(0);
        MainUI.getInstance().updateCourtInfo(1);
        this.nextMatchInfo.string = "";
    }

    public open(courtIndex: number)
    {
        const isPlaying: boolean = Data.courtInfoList[courtIndex].isPlaying;
        this.node.active = true;
        this.editCourtIndex = courtIndex;
        this.setCoutInfo(courtIndex);
        this.setEditBtnGroup(!isPlaying);
        this.btnStart.interactable = !isPlaying;
        this.btnEnd.interactable = isPlaying;
        PlayerListManager.getInstance().isEditCourtMode = true;
    }

    public close()
    {
        this.node.active = false;
        if (PlayerListManager.getInstance())
        {
            PlayerListManager.getInstance().isEditCourtMode = false;
        }
    }

    private setCoutInfo(courtIndex: number)
    {
        const courtInfo: CourtInfo = Data.courtInfoList[courtIndex];
        this.courtName.string = courtInfo.courtName;
        this.playerName_a1.string = courtInfo.teamA[0].playerName;
        this.playerName_a2.string = courtInfo.teamA[1].playerName;
        this.playerName_b1.string = courtInfo.teamB[0].playerName;
        this.playerName_b2.string = courtInfo.teamB[1].playerName;
        this.nextMatchInfo.string = Data.courtInfoList[this.editCourtIndex].nextMatchInfo;
    }
}
