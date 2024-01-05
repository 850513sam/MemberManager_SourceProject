import { _decorator, Component, Button, EditBox, Label } from 'cc';
import { CheckData, CourtInfo, Data, EPlayerType, PlayerInfo } from './Data';
import { MainUI } from './MainUI';
import { MatchManager } from './MatchManager';
import { PlayerListManager } from './PlayerListManager';
import { EMsgCode, TipsManager } from './TipsManager';
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
            const playerA1 = Data[`defaultPlayer_${i}_0`];
            const playerA2 = Data[`defaultPlayer_${i}_1`];
            const playerB1 = Data[`defaultPlayer_${i}_2`];
            const playerB2 = Data[`defaultPlayer_${i}_3`];

            courtInfo.courtName = `5-${i + 5}`;
            courtInfo.index = i;
            courtInfo.teamA.push(playerA1);
            courtInfo.teamA.push(playerA2);
            courtInfo.teamB.push(playerB1);
            courtInfo.teamB.push(playerB2);

            Data.playerInfoList.push(playerA1);
            Data.playerInfoList.push(playerA2);
            Data.playerInfoList.push(playerB1);
            Data.playerInfoList.push(playerB2);

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
        const checkData: CheckData = this.getCheckData();
        if (!checkData.isCanStart)
        {
            TipsManager.getInstance().open(EMsgCode.PLAYER_STATUS_ERROR, checkData.errorPlayer);
            return;
        }
        this.btnStart.interactable = false;
        this.btnEnd.interactable = true;
        this.setEditBtnGroup(false);
        this.updatePlayerStatus(true);
        this.updateNextMatchInfo();
        this.updateTeamRecord();
        MainUI.getInstance().updateCourtInfo(this.editCourtIndex);
        Data.courtInfoList[this.editCourtIndex].isPlaying = true;
    }

    private getCheckData(): CheckData
    {
        const checkData: CheckData = new CheckData();
        const courtInfoList: CourtInfo = Data.courtInfoList[this.editCourtIndex];
        const isA1CanPlay: boolean = courtInfoList.teamA[0].type != EPlayerType.DEFAULT && !courtInfoList.teamA[0].isPlaying;
        const isA2CanPlay: boolean = courtInfoList.teamA[1].type != EPlayerType.DEFAULT && !courtInfoList.teamA[1].isPlaying;
        const isB1CanPlay: boolean = courtInfoList.teamB[0].type != EPlayerType.DEFAULT && !courtInfoList.teamB[0].isPlaying;
        const isB2CanPlay: boolean = courtInfoList.teamB[1].type != EPlayerType.DEFAULT && !courtInfoList.teamB[1].isPlaying;
        checkData.isCanStart = isA1CanPlay && isA2CanPlay && isB1CanPlay && isB2CanPlay;
        checkData.errorPlayer += !isA1CanPlay ? `${courtInfoList.teamA[0].name}, ` : "";
        checkData.errorPlayer += !isA2CanPlay ? `${courtInfoList.teamA[1].name}, ` : "";
        checkData.errorPlayer += !isB1CanPlay ? `${courtInfoList.teamB[0].name}, ` : "";
        checkData.errorPlayer += !isB2CanPlay ? `${courtInfoList.teamB[1].name}` : "";
        return checkData;
    }

    private updateTeamRecord()
    {
        Data.teamRecordList.push(Data.courtInfoList[this.editCourtIndex].teamA);
        Data.teamRecordList.push(Data.courtInfoList[this.editCourtIndex].teamB);
    }

    private updateNextMatchInfo() 
    {
        this.nextMatchPlayers = MatchManager.getInstance().getNextMatchPlayers();
        const playerA1: PlayerInfo = this.nextMatchPlayers[0][0];
        const playerA2: PlayerInfo = this.nextMatchPlayers[0][1];
        const playerB1: PlayerInfo = this.nextMatchPlayers[1][0];
        const playerB2: PlayerInfo = this.nextMatchPlayers[1][1];
        const teamARepeatTimes: number = this.getRepeatTimes(this.nextMatchPlayers[0]);
        const teamBRepeatTimes: number = this.getRepeatTimes(this.nextMatchPlayers[1]);
        const teamAInfo: string = `${playerA1.name} (${playerA1.ability}) + ${playerA2.name} (${playerA2.ability})`;
        const teamBInfo: string = `${playerB1.name} (${playerB1.ability}) + ${playerB2.name} (${playerB2.ability})`;
        this.nextMatchInfo.string = `${teamAInfo} 重複次數 : ${teamARepeatTimes}\nvs\n${teamBInfo} 重複次數 : ${teamBRepeatTimes}`;
        Data.courtInfoList[this.editCourtIndex].nextMatchPlayers = this.nextMatchPlayers;
        Data.courtInfoList[this.editCourtIndex].nextMatchInfo = this.nextMatchInfo.string;
    }

    private getRepeatTimes(team: PlayerInfo[]): number
    {
        let repeatTimes: number = 0;
        const teamRecordList: PlayerInfo[][] = Data.teamRecordList;
        teamRecordList.forEach((teamRecord: PlayerInfo[]) => 
        {
            if (teamRecord[0].index == team[0].index || teamRecord[0].index == team[1].index)
            {
                if (teamRecord[1].index == team[0].index || teamRecord[1].index == team[1].index)
                {
                    repeatTimes++;
                }
            }
        });
        return repeatTimes;
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
        if (this.nextMatchPlayers.length == 0)
        {
            this.btnSet.interactable = false;
        }
    }

    private onBtnRefresh()
    {
        if (Data.playerInfoList.length < 12)
        {
            return;
        }
        this.updateNextMatchInfo();
        this.btnSet.interactable = true;
    }

    private onBtnEnd()
    {
        this.btnStart.interactable = true;
        this.btnEnd.interactable = false;
        this.setEditBtnGroup(true);
        this.onMatchEnd();
        MainUI.getInstance().updateCourtInfo(this.editCourtIndex);
        for (let i = 0; i < 4; i++)
        {
            this.onBtnClear(i);
        }
    }

    private onMatchEnd()
    {
        this.updatePlayerStatus(false);
        Data.courtInfoList[this.editCourtIndex].isPlaying = false;
        Data.courtInfoList[this.editCourtIndex].teamA[0].completeMatchCount++;
        Data.courtInfoList[this.editCourtIndex].teamA[1].completeMatchCount++;
        Data.courtInfoList[this.editCourtIndex].teamB[0].completeMatchCount++;
        Data.courtInfoList[this.editCourtIndex].teamB[1].completeMatchCount++;
        Data.courtInfoList[this.editCourtIndex].teamA[0].isChoose = false;
        Data.courtInfoList[this.editCourtIndex].teamA[1].isChoose = false;
        Data.courtInfoList[this.editCourtIndex].teamB[0].isChoose = false;
        Data.courtInfoList[this.editCourtIndex].teamB[1].isChoose = false;
        Data.courtInfoList[this.editCourtIndex].teamA = [Data[`defaultPlayer_${this.editCourtIndex}_0`], Data[`defaultPlayer_${this.editCourtIndex}_1`]];
        Data.courtInfoList[this.editCourtIndex].teamB = [Data[`defaultPlayer_${this.editCourtIndex}_2`], Data[`defaultPlayer_${this.editCourtIndex}_3`]];
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
        this.onBtnClear(editPlayerIndex);
        PlayerListManager.getInstance().open(true);
    }

    private onBtnClear(editPlayerIndex: number)
    {
        this.editPlayerIndex = editPlayerIndex;
        let defaultPlayer: PlayerInfo = null;
        switch (editPlayerIndex) 
        {
            case 0:
                defaultPlayer = Data[`defaultPlayer_${this.editCourtIndex}_0`];
                break;
            case 1:
                defaultPlayer = Data[`defaultPlayer_${this.editCourtIndex}_1`];
                break;
            case 2:
                defaultPlayer = Data[`defaultPlayer_${this.editCourtIndex}_2`];
                break;
            case 3:
                defaultPlayer = Data[`defaultPlayer_${this.editCourtIndex}_3`];
                break;
        }
        this.setNewPlayer(defaultPlayer);
    }

    public setNewPlayer(playerInfo: PlayerInfo)
    {
        playerInfo.isChoose = true;
        switch (this.editPlayerIndex)
        {
            case 0:
                Data.courtInfoList[this.editCourtIndex].teamA[0].isChoose = false;
                Data.courtInfoList[this.editCourtIndex].teamA[0] = playerInfo;
                this.playerName_a1.string = playerInfo.name;
                break;
            case 1:
                Data.courtInfoList[this.editCourtIndex].teamA[1].isChoose = false;
                Data.courtInfoList[this.editCourtIndex].teamA[1] = playerInfo;
                this.playerName_a2.string = playerInfo.name;
                break;
            case 2:
                Data.courtInfoList[this.editCourtIndex].teamB[0].isChoose = false;
                Data.courtInfoList[this.editCourtIndex].teamB[0] = playerInfo;
                this.playerName_b1.string = playerInfo.name;
                break;
            case 3:
                Data.courtInfoList[this.editCourtIndex].teamB[1].isChoose = false;
                Data.courtInfoList[this.editCourtIndex].teamB[1] = playerInfo;
                this.playerName_b2.string = playerInfo.name;
                break;
        }
    }

    private updateAutoMatchBtnStatus()
    {
        if (this.getIsPlayerEmpty())
        {
            
        }
    }

    private getIsPlayerEmpty(): boolean
    {
        const courtInfo: CourtInfo = Data.courtInfoList[this.editCourtIndex];
        const isPlayerEmpty = 
        courtInfo.teamA[0].type == EPlayerType.DEFAULT || 
        courtInfo.teamA[1].type == EPlayerType.DEFAULT ||
        courtInfo.teamB[0].type == EPlayerType.DEFAULT ||
        courtInfo.teamB[1].type == EPlayerType.DEFAULT;
        return isPlayerEmpty;
    }

    private init()
    {
        this.btnEnd.interactable = false;
        this.btnSet.interactable = false;
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
        this.playerName_a1.string = courtInfo.teamA[0].name;
        this.playerName_a2.string = courtInfo.teamA[1].name;
        this.playerName_b1.string = courtInfo.teamB[0].name;
        this.playerName_b2.string = courtInfo.teamB[1].name;
        this.nextMatchInfo.string = Data.courtInfoList[this.editCourtIndex].nextMatchInfo;
        this.nextMatchPlayers = Data.courtInfoList[this.editCourtIndex].nextMatchPlayers;
    }
}
