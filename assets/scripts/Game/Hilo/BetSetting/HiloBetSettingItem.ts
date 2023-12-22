import { Button } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";
import { HiloBetSettingManager } from "./HiloBetSettingManager";
import { HiloGameData } from "../HiloGameData";
import NumberFormatter from "../../../Toolkit/Components/NumberFormatter";
import { HiloButtonManager } from "../UI/HiloButtonManager";

const { ccclass, property } = _decorator;
@ccclass("HiloBetSettingItem")
export class HiloBetSettingItem extends Component 
{
    @property(NumberFormatter)
    private valueTxt: NumberFormatter = null;
    @property(Button)
    private btn: Button = null;

    private betValue: number = 0;
    private betIndex: number = 0;

    protected start() 
    {
        this.btn.node.on(Button.EventType.CLICK, this.onBtnBetValue.bind(this));
    }

    private onBtnBetValue() 
    {
        HiloBetSettingManager.getInstance().closeBetSetting();
        HiloGameData.getInstance().setCurrentBetValue(this.betValue);
        HiloGameData.getInstance().setBetIndex(this.betIndex);
        HiloButtonManager.getInstance().updateCurrentBetValue();
        HiloBetSettingManager.getInstance().btnBackDefault();
        this.btn.interactable = false;
    }

    public setBetValue(index: number, value: number) 
    {
        this.valueTxt.value = value;
        this.betIndex = index;
        this.betValue = value;
    }
}
