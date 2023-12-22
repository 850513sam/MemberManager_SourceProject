import { PlayerResponseData } from "./Player.dto";
import { ResultResponseData } from "./Result.dto";

export enum TableState {
    Init = 'init', // 初始化
    Waiting = 'waiting', // 等待新局開始
    Start = 'start', // 遊戲開始
    Betting = 'betting', // 等待玩家下注
    Receiving = 'receiving', // 結束下注
    Increasing = 'increasing', // 增長中
    Showing = 'showing', // 開獎
    Cancel = 'cancel', // 取消當局
    Finish = 'finish', // - 遊戲暫停，等待服務人員處理
}

export enum PayType {
    Odd = 'odd',
    Even = 'even',
    Count0 = 'count0',
    Count1 = 'count1',
    Count3 = 'count3',
    Count4 = 'count4',
}

export enum TableType {
    Casual = 'casual',
    Novice = 'novice',
    Advance = 'advance',
    Expert = 'expert',
}

export type TableLimitData = {
    /** useless ??? */
    Min: number;
    /** max total bet */
    Max: number; // max total bet
};

export type BetLimitData = {
    /** min bet on single bet option ( = min total bet) */
    Min: number;
    /** max bet on single bet option */
    Max: number;
    /** available clip denom index list */
    Bets: number[];
    Default: number;
};

// type ReconnectTableInfo = {
//     Bets: BetData[];
//     Denom: number;
//     BetLimit: number;
//     Balance: number;
// };

export type ChipDenomList = {
    Default: number;
    /** denominations */
    Values: number[];
};

export type BettingOptionBetInfo = {
    Bet: number;
    PlayerID: number;
    Wager: number;
    Multiplier?: number;
};

type DetailedTableStatusData = {
    TableID: string;
    Confirming?: boolean;
    Stopped?: boolean;
    Bets?: { [key: number]: BettingOptionBetInfo };
    Players?: { [key: number]: PlayerResponseData };

    // generate by front-end to determine if event is received when enter table
    EnteringTable: boolean;

    Hash?: string;
};

export type TableTemporalStatusData = {
    Time: number;
    NextStateTime: number;
    State: TableState;
    StateDuration: number;
    StateElapsed: number;
};

export type PreviewTableStatusData = {
    OnlinePlayer: number;
    PlayerID: number;
    RoundID?: number;
    RoundCount?: number;
    // front-end define
    ClientReceiveTime: number;
    leftTime: () => number;
    currentTime: () => number;
} & TableTemporalStatusData;

type DetailedTableInfoData = {
    PayTable: { [value in PayType]: number };
    WagerToPayType: { [key: string]: PayType };

    /** reconnect data */
    // BetData?: ReconnectTableInfo;

    /** init table status */
    Event: TableStatusData;
};

export type PreviewTableInfoData = {
    GameID: string;
    ID: string;
    Hall: TableType;
    /** all chip denom list */
    Bets: ChipDenomList;
    Denoms: number[];
    BetLimits: BetLimitData[];
    TableLimit: TableLimitData;
    History: number[];
    MaxSeatCount: number;
};

export type TableInfoData = PreviewTableInfoData & DetailedTableInfoData;
export type TableStatusData = PreviewTableStatusData & DetailedTableStatusData;
export type PreviewTableData = PreviewTableInfoData & PreviewTableStatusData;

export type EnterTableRequestData = {
    HallType: string;
    ID: string;
};

export type EnterTableResponseData = TableInfoData &
    PreviewTableStatusData
    & {
        Result?: ResultResponseData;
    };
