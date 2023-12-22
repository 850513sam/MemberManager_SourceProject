import { Component } from "cc";
import { _decorator } from "cc";
import { HiloGameData } from "../HiloGameData";
import NumberFormatter from "../../../Toolkit/Components/NumberFormatter";
import { Label } from "cc";
import { Sprite } from "cc";
import { Button } from "cc";
import { UIOpacity } from "cc";
import { tween } from "cc";
import { Node } from "cc";
import { Vec3 } from "cc";
import { SpriteFrame } from "cc";
import LocalizedLabel from "../../../I18n/LocalizedComponent/LocalizedLabel";
import { HiloScoreManager } from "./HiloScoreManager";

const { ccclass, property } = _decorator;
@ccclass('HiloResultManager')
export class HiloResultManager extends Component 
{
    @property(Button)
    private mask: Button = null;
    @property(Node)
    private resultPage: Node = null;
    @property(Sprite)
    private bg: Sprite = null;
    @property(Label)
    private resultInfoTxt: Label = null;
    @property(Button)
    private btnClose: Button = null;
    @property(Label)
    private oddsTxt: Label = null;
    @property(Label)
    private settleInfoTxt: Label = null;
    @property(NumberFormatter)
    private resultMoneyTxt: NumberFormatter = null;
    @property(SpriteFrame)
    private winBg: SpriteFrame = null;
    @property(SpriteFrame)
    private lossBg: SpriteFrame = null;
    @property(Node)
    private oddsGroup: Node = null;
    @property(Node)
    private moneyGroup: Node = null;

    private readonly winHexColor: string = "#FBCB14";
    private readonly lossHexColor: string = "#A8BBFF";
    private isShowResultPage: boolean = false;

    private static instance: HiloResultManager = null;
    public static getInstance(): HiloResultManager
    {
        return HiloResultManager.instance;
    }
    
    protected start()
    {
        HiloResultManager.instance = this;
        this.node.active = false;
        this.btnClose.node.on(Button.EventType.CLICK, this.closeResultPage.bind(this));
        this.mask.node.on(Button.EventType.CLICK, this.closeResultPage.bind(this));
        this.mask.interactable = false;
    }

    public openResultPage()
    {
        if (this.node.active)
        {
            return;
        }
        this.node.active = true;
        this.updateResultInfo();
        this.showPageEffect(true);
    }

    private closeResultPage()
    {
        if (!this.isShowResultPage)
        {
            return;
        }
        this.showPageEffect(false);
        this.mask.interactable = false;
        this.btnClose.interactable = false;
        this.isShowResultPage =  false;
        HiloScoreManager.getInstance().updateScoreInfo(false);
    }

    private updateResultInfo()
    {
        const isWin: boolean = HiloGameData.getInstance().getIsWin();
        const fontHex: string = isWin ? this.winHexColor : this.lossHexColor;
        const score: number = HiloGameData.getInstance().getScore();
        const betValue: number = HiloGameData.getInstance().getCurrentBetValue();
        let odds: number = HiloGameData.getInstance().getCurrentOdds();
        odds *= isWin ? 1 : -1;
        this.resultInfoTxt.color.fromHEX(fontHex);
        this.bg.spriteFrame = isWin ? this.winBg : this.lossBg;
        this.oddsTxt.string = (odds / 100).toString();
        this.resultMoneyTxt.value = isWin ? score :betValue;
        this.resultInfoTxt.getComponent(LocalizedLabel).key = isWin ? "YOU_WON" : "YOU_LOSS";
        this.settleInfoTxt.getComponent(LocalizedLabel).key = isWin ? "TOTAL_WIN" : "TOTAL_LOSS";
    }

    private showPageEffect(isOpen: boolean)
    {
        const isWin: boolean = HiloGameData.getInstance().getIsWin();
        const maskOpacity: UIOpacity = this.mask.getComponent(UIOpacity);
        const pageOpacity: UIOpacity = this.resultPage.getComponent(UIOpacity);
        const startScale: Vec3 = isOpen ? Vec3.ZERO : Vec3.ONE;
        const targetScale: Vec3 = isOpen ? Vec3.ONE : Vec3.ZERO;
        const maxScale: Vec3 = new Vec3(1.1, 1.1, 1.1);
        const startOpacity: number = isOpen ? 0 : 255;
        const targetOpacity: number = isOpen ? 255 : 0;
        const delayTime: number = isOpen && !isWin ? 1.5 : 0;
        maskOpacity.opacity = startOpacity;
        this.resultPage.scale = startScale;
        this.oddsGroup.scale = this.moneyGroup.scale = isOpen ? Vec3.ZERO : Vec3.ONE;
        tween(maskOpacity).delay(delayTime).to(0.3, { opacity: targetOpacity }).start();
        tween(pageOpacity).delay(delayTime).call(() => 
        {
            tween(this.resultPage).to(0.25, { scale: maxScale} ).to(0.25, { scale: targetScale }).call(() => 
            {
                if (isOpen)
                {
                    tween(this.oddsGroup).to(0.15, { scale: maxScale} ).to(0.15, { scale: Vec3.ONE }).call(() => 
                    {
                        tween(this.moneyGroup).to(0.15, { scale: maxScale }).to(0.15, { scale: Vec3.ONE }).call(() => 
                        {
                            this.isShowResultPage = true;
                        }).start();
                    }).start();
                }
                this.mask.interactable = true;
                this.btnClose.interactable = true;
                this.node.active = isOpen;
                
            }).start();
        }).start();
    }
}
