import { _decorator } from "cc";

const { ccclass } = _decorator;
@ccclass('Data')
export class Data
{
    public static playerInfoList: PlayerInfo[] = [];
    public static courtInfoList: CourtInfo[] = [];
}

export class PlayerInfo
{
    public playerName: string = "";
    public playerAbility: number = 1;
    public isPlaying: boolean = false;
    public completeMatchCount: number = 0;
}

export class CourtInfo
{
    public index: number = 0;
    public courtName: string = "";
    public isPlaying: boolean = false;
    public nextMatchInfo: string = "";
    public teamA: PlayerInfo[] = [];
    public teamB: PlayerInfo[] = [];
    public defaultTeamA: PlayerInfo[] = [];
    public defaultTeamB: PlayerInfo[] = [];
}
