import { Label } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";
import { HiloGameData } from "../HiloGameData";
import { Vec3 } from "cc";
import { tween } from "cc";
import { UIOpacity } from "cc";

const { ccclass, property } = _decorator;
@ccclass('HiloProbabilityInfoManager')
export class HiloProbabilityInfoManager extends Component 
{
    @property(Label)
    private highProbabilityTxt: Label = null;
    @property(Label)
    private lowProbabilityTxt: Label = null;

    private static instance: HiloProbabilityInfoManager = null;
    public static getInstance(): HiloProbabilityInfoManager 
    {
        return HiloProbabilityInfoManager.instance;
    }
   
    protected start()
    {
        HiloProbabilityInfoManager.instance = this;
        this.highProbabilityTxt.string = "";
        this.lowProbabilityTxt.string = "";
    }

    public updateProbabilityInfo()
    {
        let duration: number = 0.2;
        let targetScale: Vec3 = new Vec3(1.2, 1.2, 1.2);
        let highProbabilityOpacity: UIOpacity = this.highProbabilityTxt.getComponent(UIOpacity);
        let lowProbabilityOpacity: UIOpacity = this.lowProbabilityTxt.getComponent(UIOpacity);

        tween(highProbabilityOpacity).to(duration, { opacity: 0 }).call(() => 
        {
            highProbabilityOpacity.opacity = 255;
            this.highProbabilityTxt.node.scale = Vec3.ZERO;
            this.highProbabilityTxt.string = `${HiloGameData.getInstance().getProbabilityList()[1].toString()}%`;
            tween(this.highProbabilityTxt.node).delay(duration * 2).to(duration, { scale: targetScale }).to(duration, { scale: Vec3.ONE }).delay(duration / 4).call(() => 
            {
                tween(this.lowProbabilityTxt.node).to(duration, { scale: targetScale }).to(duration, { scale: Vec3.ONE }).start();
            }).start();
        }).start();
        tween(lowProbabilityOpacity).to(duration, { opacity: 0 }).call(() => 
        {
            lowProbabilityOpacity.opacity = 255;
            this.lowProbabilityTxt.node.scale = Vec3.ZERO;
            this.lowProbabilityTxt.string = `${HiloGameData.getInstance().getProbabilityList()[0].toString()}%`;
        }).start();
    }
}
