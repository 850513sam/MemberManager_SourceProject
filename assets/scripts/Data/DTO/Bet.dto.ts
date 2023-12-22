import { DebugRequestData } from "./Debug.dto";
import { Probability } from "./Game.dto";

/** [ bettingOptionIndex, chipIndex, chipCount ] */
export enum ChipType {
    Denom5,
    Denom10,
    Denom20,
    Denom50,
    Denom100,
    Denom200,
    Denom500,
    Denom1K,
    Denom2K,
    Denom5K,
    Denom10K,
    Denom20K,
    /** generate by front-end, use to distinguish gray chip */
    NoDenom,
}

// [Wager, ChipType, number]
export type BetData = [number, ChipType, number];

export class BetRequestData
{
    Wager: number;
    Bet: number;
    Denom: number;
    Debug: DebugRequestData;
};

export class BetResponseData
{
    Balance: number;
    Card: number;
    Probability: Probability
    Multiplier: number;
    Wager: number;
    Secret: string;
    Hash: string;
    NextHash: string;
};
