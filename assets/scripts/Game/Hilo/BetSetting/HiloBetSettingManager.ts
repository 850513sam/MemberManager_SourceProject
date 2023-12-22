import { Prefab } from "cc";
import { Button } from "cc";
import { instantiate } from "cc";
import { Node } from "cc";
import { _decorator } from "cc";
import { Component } from "cc";
import { HiloBetSettingItem } from "./HiloBetSettingItem";
import { HiloGameData } from "../HiloGameData";

const { ccclass, property } = _decorator;
@ccclass('HiloBetSettingManager')
export class HiloBetSettingManager extends Component 
{
    @property(Prefab)
    private betSettingItem: Prefab = null;
    @property(Node)
    private itemGroup: Node = null;
    @property(Node)
    private mask: Node = null;

    private static instance: HiloBetSettingManager = null;
    private betItemGroup:Node[] = [];

    public btnBackDefault() 
    {
        this.betItemGroup.map(betItem => 
        {
            betItem.getComponent(Button).interactable = true;
        });
    }    
        
    public static getInstance(): HiloBetSettingManager 
    {
        return HiloBetSettingManager.instance;
    }
    
    protected start() 
    {
        HiloBetSettingManager.instance = this;
        this.node.active = false;
        this.mask.on(Button.EventType.CLICK, this.closeBetSetting.bind(this));
    }

    public initBetSettingPage()
    {
        let betList: Array<number> = HiloGameData.getInstance().getBetList();
        for (let i: number = 0; i < betList.length; i++)
        {
            this.addBetItem(i, betList[i]);
        }
    }

    private addBetItem(index: number, value: number)
    {
        let betItem: Node = instantiate(this.betSettingItem);
        betItem.getComponent(HiloBetSettingItem).setBetValue(index, value);
        betItem.setParent(this.itemGroup);
        if (index == HiloGameData.getInstance().getDefaultBetIndex()) 
        {
            betItem.getComponent(Button).interactable = false;
        }
        this.betItemGroup.push(betItem);
    }
    
    public openBetSetting()
    {
        this.node.active = true;
    }

    public closeBetSetting()
    {
        this.node.active = false;
    }
}
