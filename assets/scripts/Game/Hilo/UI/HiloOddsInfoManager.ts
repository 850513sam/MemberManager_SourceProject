import { Label } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";
import { HiloGameData } from "../HiloGameData";
import { HiloPokerTool } from "../HiloPokerTool";
import { tween } from "cc";
import { Vec3 } from "cc";
import { UIOpacity } from "cc";

const { ccclass, property } = _decorator;
@ccclass('HiloOddsInfoManager')
export class HiloOddsInfoManager extends Component 
{
    @property(Label)
    private highOddsTxt: Label = null;
    @property(Label)
    private lowOddsTxt: Label = null;

    private static instance: HiloOddsInfoManager = null;
    public static getInstance(): HiloOddsInfoManager 
    {
        return HiloOddsInfoManager.instance;
    }
    
    protected start()
    {
        HiloOddsInfoManager.instance = this;
        this.highOddsTxt.string = "";
        this.lowOddsTxt.string = "";
    }

    public updateOddsInfo()
    {
        let cardIndex: number = HiloGameData.getInstance().getCardIndex();
        let oddsList: Array<Array<number>> = HiloGameData.getInstance().getOddsList();
        let pokerValue: number = HiloPokerTool.getInstance().getPokerValue(cardIndex);
        let isValueMaxOrMin: boolean = pokerValue == 1 || pokerValue == 13;
        let oddsIndex1: number = isValueMaxOrMin ? 1 : 0;
        let oddsIndex2: number = isValueMaxOrMin ? 0 : 1;
        let highOdds: string = (oddsList[oddsIndex1][pokerValue - 1] / 100).toFixed(2);
        let lowOdds: string = (oddsList[oddsIndex2][pokerValue - 1] / 100).toFixed(2);
        
        let duration: number = 0.2;
        let targetScale: Vec3 = new Vec3(1.2, 1.2, 1.2);
        let highOddsOpacity: UIOpacity = this.highOddsTxt.getComponent(UIOpacity);
        let lowOddsOpacity: UIOpacity = this.lowOddsTxt.getComponent(UIOpacity);
        
        tween(lowOddsOpacity).to(duration, { opacity: 0 }).call(() => 
        {
            lowOddsOpacity.opacity = 255;
            this.lowOddsTxt.node.scale = Vec3.ZERO;
            this.lowOddsTxt.string = `${lowOdds}x`;
            tween(this.highOddsTxt.node).delay(duration * 2).to(duration, { scale: targetScale }).to(duration, { scale: Vec3.ONE }).delay(duration / 4).call(() => 
            {
                tween(this.lowOddsTxt.node).to(duration, { scale: targetScale }).to(duration, { scale: Vec3.ONE }).start();
            }).start();
        }).start();
        tween(highOddsOpacity).to(duration, { opacity: 0 }).call(() => 
        {
            highOddsOpacity.opacity = 255;
            this.highOddsTxt.node.scale = Vec3.ZERO;
            this.highOddsTxt.string = `${highOdds}x`;
        }).start();
    }
}
