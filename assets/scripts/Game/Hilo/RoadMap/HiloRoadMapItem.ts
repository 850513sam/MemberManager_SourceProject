import { Label } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";
import { HiloGameData } from "../HiloGameData";

const { ccclass } = _decorator;
@ccclass('HiloRoadMapItem')
export class HiloRoadMapItem extends Component
{
    public setOddsInfo(odds: number)
    {
        let oddsTxt: Label = this.node.children[0].getComponent(Label);
        let isWin: boolean = HiloGameData.getInstance().getIsWin();
        let fontHexColor: string = isWin ? "#FFFFFF" : "#FF0000";
        oddsTxt.string = `${(odds).toFixed(2)}x`;
        oddsTxt.color.fromHEX(fontHexColor);
    }
}
