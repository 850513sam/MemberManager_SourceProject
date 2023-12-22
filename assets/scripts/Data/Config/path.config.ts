import { BalanceResponseData } from "../DTO/Balance.dto";
import { BetRequestData, BetResponseData } from "../DTO/Bet.dto";
import { DebugRequestData } from "../DTO/Debug.dto";
import { CashoutRequestData, CashoutResponseData, SkipRequestData, SkipResponseData } from "../DTO/Game.dto";
import { LoginRequestData, LoginResponseData } from "../DTO/Login.dto";
import { EnterTableResponseData } from "../DTO/Table.dto";

export enum PathName 
{
    Refresh = 'game.table.refresh',
    Debug = 'game.table.debug',
    Login = 'auth.login',
    Balance = 'auth.balance',
    Hall = 'game.halls',
    EnterTable = 'game.table.entry',
    ExitTable = 'game.table.exit',
    Cashout = 'game.table.cashout',
    Ack = 'game.ack',
    Bet = 'game.table.bet',
    Skip = 'game.table.skip',
}

export type RequestResponseDataType = 
{
    [PathName.Refresh]: [undefined, EnterTableResponseData];
    [PathName.Debug]: [DebugRequestData, never];
    [PathName.Login]: [LoginRequestData, LoginResponseData];
    [PathName.Hall]: [undefined, undefined];
    [PathName.EnterTable]: [undefined, EnterTableResponseData];
    [PathName.ExitTable]: [undefined, undefined];
    [PathName.Bet]: [BetRequestData, BetResponseData];
    [PathName.Ack]: [undefined, never];
    [PathName.Cashout]: [CashoutRequestData, CashoutResponseData];
    [PathName.Skip]: [SkipRequestData, SkipResponseData];
};

export type PublishDataType = 
{
    [PathName.Login]: LoginResponseData;
    [PathName.Balance]: BalanceResponseData;
    [PathName.EnterTable]: EnterTableResponseData;
    [PathName.ExitTable]: undefined;
    [PathName.Bet]: BetResponseData;
    [PathName.Cashout]: CashoutResponseData;
    [PathName.Skip]: SkipResponseData;
};
