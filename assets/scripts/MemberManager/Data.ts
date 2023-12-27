import { _decorator } from "cc";

const { ccclass } = _decorator;

export class CheckData
{
    public isCanStart: boolean = false;
    public errorPlayer: string = "";
}

export class PlayerInfo
{
    public playerIndex: number = -1;
    public playerName: string = "x";
    public playerAbility: number = 1;
    public isPlaying: boolean = false;
    public isChoose: boolean = false;
    public completeMatchCount: number = 0;
    public isDefaultPlayer: boolean = false;

    public constructor(playerIndex: number, isDefaultPlayer: boolean = false)
    {
        this.playerIndex = playerIndex;
        this.isDefaultPlayer = isDefaultPlayer;
    }
}

export class CourtInfo
{
    public index: number = 0;
    public courtName: string = "";
    public isPlaying: boolean = false;
    public teamA: PlayerInfo[] = [];
    public teamB: PlayerInfo[] = [];
    public nextMatchInfo: string = "";
    public nextMatchPlayers: PlayerInfo[][] = [];
}

@ccclass('Data')
export class Data
{
    public static playerInfoList: PlayerInfo[] = [];
    public static courtInfoList: CourtInfo[] = [];

    public static readonly defaultPlayer_0_0: PlayerInfo = new PlayerInfo(-1, true);
    public static readonly defaultPlayer_0_1: PlayerInfo = new PlayerInfo(-1, true);
    public static readonly defaultPlayer_0_2: PlayerInfo = new PlayerInfo(-1, true);
    public static readonly defaultPlayer_0_3: PlayerInfo = new PlayerInfo(-1, true);

    public static readonly defaultPlayer_1_0: PlayerInfo = new PlayerInfo(-1, true);
    public static readonly defaultPlayer_1_1: PlayerInfo = new PlayerInfo(-1, true);
    public static readonly defaultPlayer_1_2: PlayerInfo = new PlayerInfo(-1, true);
    public static readonly defaultPlayer_1_3: PlayerInfo = new PlayerInfo(-1, true);

    public static teamRecordList: PlayerInfo[][] = [];
}
