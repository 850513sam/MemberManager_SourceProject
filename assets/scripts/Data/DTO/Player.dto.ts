import { BetData } from './Bet.dto';

export type PlayerResponseData = {
    ID: number;
    Nickname: string;
    Avatar: string;
    Balance: number;
    WinCount: number;
    BetCount: number;
    Bets: BetData[];
};
