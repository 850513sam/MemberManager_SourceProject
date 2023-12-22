export class CashoutData
{
    Bet: number;
    Multiplier: number;
    PlayerID: number;
    Wager: number;
};

export class CashoutRequestData
{
    Wager: number;
};

export class CashoutResponseData
{
    Multiplier: number;
    Cards: Array<number>;
    Wagers: Array<number>;
    Payouts: Array<number>;
    TotalBet: number;
    TotalWin: number;
    Balance: number;
};

export class SkipRequestData
{
};

export class SkipResponseData
{
    Balance: number;
    Card: number;
    Probability: Probability;
    Multiplier: number;
    Secret: string;
    Hash: string;
    NextHash: string;
};

export class Probability
{
    property1: number;
    property2: number;
};
