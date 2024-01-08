import { _decorator } from "cc";

const { ccclass } = _decorator;

export enum EPlayerType
{
    DEFAULT,
    NORMAL,
    SPECIAL,
}

export class CheckData
{
    public isCanStart: boolean = false;
    public errorPlayer: string = "";
}

export class PlayerInfo
{
    public index: number = -1;
    public name: string = "x";
    public ability: number = 1;
    public type: EPlayerType = EPlayerType.DEFAULT;
    public isPlaying: boolean = false;
    public isChoose: boolean = false;
    public completeMatchCount: number = 0;

    public constructor(playerIndex: number = -1)
    {
        this.index = playerIndex;
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

    public static readonly defaultPlayer_0_0: PlayerInfo = new PlayerInfo();
    public static readonly defaultPlayer_0_1: PlayerInfo = new PlayerInfo();
    public static readonly defaultPlayer_0_2: PlayerInfo = new PlayerInfo();
    public static readonly defaultPlayer_0_3: PlayerInfo = new PlayerInfo();

    public static readonly defaultPlayer_1_0: PlayerInfo = new PlayerInfo();
    public static readonly defaultPlayer_1_1: PlayerInfo = new PlayerInfo();
    public static readonly defaultPlayer_1_2: PlayerInfo = new PlayerInfo();
    public static readonly defaultPlayer_1_3: PlayerInfo = new PlayerInfo();

    public static teamRecordList: PlayerInfo[][] = [];
}
