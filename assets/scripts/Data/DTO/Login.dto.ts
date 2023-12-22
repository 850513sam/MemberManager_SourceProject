export type LoginRequestData = {
    Token: string;
    PlatformsID: number;
    WalletTypesID: number;
    EntryTable: boolean;
};

export type LoginResponseData = {
    Nickname: string;
    Avatar: string;
    Balance: number;
    Denom: number;
    AccountInfoURL: string;
    LastTable?: string;
    LastRoundID?: number;
    // BankerPay?: number;
    // UnlimitedBalance?: boolean;
    // AccessToken?: string;
};
