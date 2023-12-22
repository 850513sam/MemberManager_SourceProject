export enum DebugMode 
{
    None,
    SpecifyWinOrLose,
    SpecifyResult,
}

export class DebugRequestData
{
    Mode: DebugMode;
    Rank: number;
    Win: boolean;
};
