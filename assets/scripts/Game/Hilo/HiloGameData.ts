import { Component } from "cc";
import { _decorator } from "cc";

const { ccclass } = _decorator;
@ccclass('HiloGameData')
export class HiloGameData extends Component 
{
    private static instance: HiloGameData = null;
    public static getInstance(): HiloGameData 
    {
        if (!HiloGameData.instance)
        {
            HiloGameData.instance = new HiloGameData();
        }
        return HiloGameData.instance;
    }

    private betList: Array<number> = new Array<number>();
    public getBetList(): Array<number>
    {
        return this.betList;
    }

    public setBetList(betList: Array<number>)
    {
        this.betList = betList;
    }

    private currentBetValue: number = 0;
    public getCurrentBetValue(): number
    {
        return this.currentBetValue;
    }

    public setCurrentBetValue(currentBetValue: number)
    {
        this.currentBetValue = currentBetValue;
    }

    private score: number = 0;
    public getScore(): number
    {
        return this.score;
    }

    public setScore(score: number)
    {
        this.score = score;
    }

    private cardIndex: number = 0;
    public getCardIndex(): number
    {
        return this.cardIndex;
    }

    public setCardIndex(cardIndex: number)
    {
        this.cardIndex = cardIndex;
    }

    private currentOdds: number = 100;
    public getCurrentOdds(): number
    {
        return this.currentOdds;
    }

    public setCurrentOdds(currentOdds: number)
    {
        if (currentOdds <= 0)
        {
            return;
        }
        this.currentOdds = currentOdds;
    }

    private isNewRound: boolean = true;
    public getIsNewRound(): boolean
    {
        return this.isNewRound;
    }

    public setIsNewRound(isNewRound: boolean)
    {
        this.isNewRound = isNewRound;
    }

    private isFirstIntoGame: boolean = true;
    public getIsFirstIntoGame(): boolean
    {
        return this.isFirstIntoGame;
    }

    public setIsFirstIntoGame(isFirstIntoGame: boolean)
    {
        this.isFirstIntoGame = isFirstIntoGame;
    }

    private isWin: boolean = true;
    public getIsWin(): boolean
    {
        return this.isWin;
    }

    public setIsWin(isWin: boolean)
    {
        this.isWin = isWin;
    }

    private betIndex: number = 0;
    public getBetIndex(): number
    {
        return this.betIndex;
    }

    public setBetIndex(betIndex: number)
    {
        this.betIndex = betIndex;
    }

    private probabilityList: Array<number> = new Array<number>();
    public getProbabilityList(): Array<number>
    {
        return this.probabilityList;
    }

    public setProbabilityList(data: any)
    {
        let probabilityList: Array<number> = new Array<number>();
        probabilityList.push(Number((data[0][1] * 100).toFixed(2)));
        probabilityList.push(Number((data[1][1] * 100).toFixed(2)));
        this.probabilityList = probabilityList;
    }

    private oddsList: Array<Array<number>> = new Array<Array<number>>();
    public getOddsList(): Array<Array<number>>
    {
        return this.oddsList;
    }

    public setOddsList(oddsList: Array<Array<number>>)
    {
        this.oddsList = oddsList;
    }

    private betIndexList: Array<number> = new Array<number>();
    public getBetIndexList(): Array<number>
    {
        return this.betIndexList;
    }

    public setBetIndexList(betIndexList: Array<number>)
    {
        this.betIndexList = betIndexList;
    }
    
    private nextHash: string
    public setNextHash(nextHash: string)
    {
        this.nextHash = nextHash;
    }

    public getNextHash(): string
    {
        return this.nextHash;
    }

    private defaultBetIndex: number = 0;
    public setDefaultBetIndex(index: number)
    {
        this.defaultBetIndex = index;
    }

    public getDefaultBetIndex(): number
    {
        return this.defaultBetIndex;
    }
}
