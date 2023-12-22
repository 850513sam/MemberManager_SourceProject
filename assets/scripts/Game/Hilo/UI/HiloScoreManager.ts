import { Component } from "cc";
import { _decorator } from "cc";
import { HiloGameData } from "../HiloGameData";
import NumberFormatter from "../../../Toolkit/Components/NumberFormatter";

const { ccclass, property } = _decorator;
@ccclass('HiloScoreManager')
export class HiloScoreManager extends Component 
{
    @property(NumberFormatter)
    private scoreTxt: NumberFormatter = null;

    private static instance: HiloScoreManager = null;
    public static getInstance(): HiloScoreManager
    {
        return HiloScoreManager.instance;
    }
    
    protected start()
    {
        HiloScoreManager.instance = this;
    }

    public updateScoreInfo(isShowScore: boolean)
    {
        const gameData: HiloGameData = HiloGameData.getInstance();
        const isWin: boolean = gameData.getIsWin();
        const currentBet: number = gameData.getCurrentBetValue();
        const currentOdds: number = gameData.getCurrentOdds();
        const score: number = Number((currentBet * currentOdds / 100));
        gameData.setScore(score);
        this.scoreTxt.value = isWin ? Number((currentBet * currentOdds / 100).toFixed(2)) : 0;
        this.scoreTxt.node.active = isShowScore;
    }
}
