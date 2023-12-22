export type ResultData = {
    Bet: number;
    Win?: number;
};

export type ResultResponseData = {
    Multiplier: number;
    TotalBet: number;
    TotalWin: number;
    PreviousTotalWin: number;
    Balance: number;
    RoundID: number;
    SettingID: number;
    Status: number;
    Result?: { [key: number]: ResultData };
    Secret: string;
    LiveTime: number;
};
