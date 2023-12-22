import { Prefab } from "cc";
import { Vec3 } from "cc";
import { instantiate } from "cc";
import { Node } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";
import { HiloRoadMapItem } from "./HiloRoadMapItem";
import { HiloPokerTool } from "../HiloPokerTool";
import { tween } from "cc";
import { UITransform } from "cc";
import { Size } from "cc";
import { HiloGameData } from "../HiloGameData";
import { UIOpacity } from "cc";
import { PlayerOperateType } from "../HiloGameLogic";
import { HiloPlayerOperateTypeItem } from "./HiloPlayerOperateTypeItem";
import { SpriteFrame } from "cc";
import { HiloButtonManager } from "../UI/HiloButtonManager";
import { ScrollView } from "cc";

const { ccclass, property } = _decorator;
@ccclass('HiloRoadMapManager')
export class HiloRoadMapManager extends Component
{
    @property(Node)
    private cardGroup: Node = null;
    @property(Prefab)
    private roadMapItem: Prefab = null;
    @property(Prefab)
    private operateIcon: Prefab = null;
    @property(Node)
    private bar: Node = null;
    @property(SpriteFrame)
    private highIcon: SpriteFrame = null;
    @property(SpriteFrame)
    private lowIcon: SpriteFrame = null;
    @property(SpriteFrame)
    private skipIcon: SpriteFrame = null;
    @property(ScrollView)
    private roadMapScrollView: ScrollView = null;
    
    private lastCard: Node = null;
    private firstCard: Node = null;
    private operateType: PlayerOperateType = PlayerOperateType.DEFAULT;
    private cardList: Array<Node> = [];
    private operateIconList: Array<Node> = [];
    private readonly screenMaxAmount: number = 5;
    private readonly cardInterval: number = 115;
    private readonly operateIconInterval: number = 58;
    private readonly startX: number = -255;
    private readonly posY: number = 15;
    private readonly barInitPos: Vec3 = new Vec3(-5000, -12);
    private readonly cardsGroupInitSize: Size = new Size(600 ,170);
    private readonly cardAniScale = new Vec3(1.1, 1.1, 1.1);

    private static instance: HiloRoadMapManager = null;
    public static getInstance(): HiloRoadMapManager 
    {
        return HiloRoadMapManager.instance;
    }
    
    protected start()
    {
        HiloRoadMapManager.instance = this;
    }

    public addRecord(operateType: PlayerOperateType, isFirstCard: boolean)
    {
        const cardIndex: number = HiloGameData.getInstance().getCardIndex();
        const currentOdds: number = HiloGameData.getInstance().getCurrentOdds() / 100;
        const delayTime: number = isFirstCard ? 0.4 : 0.8;
        this.operateType = operateType;
        tween(this.node).delay(delayTime).call(() => 
        {
            if (this.cardList.length < this.screenMaxAmount)
            {
                this.addCard(cardIndex, currentOdds);
            }
            else
            {
                const cardGroupTransform: UITransform = this.cardGroup.getComponent(UITransform);
                const width: number = cardGroupTransform.contentSize.width + this.cardInterval * 1;
                const height: number = cardGroupTransform.contentSize.height;
                const contentSize: Size = new Size(width, height)
                cardGroupTransform.setContentSize(contentSize);
                this.moveRecord(cardIndex, currentOdds);
            }
        }).start();
    }

    private addCard(cardIndex: number, currentOdds: number)
    {
        let card: Node = instantiate(this.roadMapItem);
        let posX: number = 0;
        const cardPos: Vec3 = new Vec3();
        const duration: number = 0.1;
        const scale: number = 1.1;
        this.cardList.push(card);
        card.setParent(this.cardGroup);
        if (!this.firstCard)
        {
            this.firstCard = card;
        }
        if (!this.lastCard)
        {
            card.position = new Vec3(this.startX, this.posY);
        }
        card.children[1].active = this.operateType == PlayerOperateType.DEFAULT;
        posX = !this.lastCard ? this.startX : this.lastCard.position.x + this.cardInterval;
        cardPos.set(posX, this.posY);
        card.position = cardPos;
        this.lastCard = card;
        card.getComponent(HiloRoadMapItem).setOddsInfo(currentOdds);
        card = HiloPokerTool.getInstance().getPoker(card, cardIndex);
        tween(card).to(duration, {scale: new Vec3(card.scale.x * scale, card.scale.y * scale)})
        .to(duration, {scale: new Vec3(card.scale.x, card.scale.y)}).call(() => 
        {
            this.addOperateIcon(cardPos);
        }).start();
    }

    private addOperateIcon(currentCardPos: Vec3)
    {
        const operateIcon: Node = instantiate(this.operateIcon);
        let icon: SpriteFrame = null;
        switch (this.operateType)
        {
            case PlayerOperateType.HIGH:
                icon = this.highIcon;
                break;
            case PlayerOperateType.LOW:
                icon = this.lowIcon;
                break;
            case PlayerOperateType.SKIP:
                icon = this.skipIcon;
                break;
            default:
                return;
        }
        this.operateIconList.push(operateIcon);
        this.cardGroup.insertChild(operateIcon, 0);
        operateIcon.position = new Vec3(currentCardPos.x - this.operateIconInterval, currentCardPos.y);
        operateIcon.getComponent(HiloPlayerOperateTypeItem).setSprite(icon);
        operateIcon.scale = Vec3.ZERO;
        tween(operateIcon).to(0.1, { scale: this.cardAniScale }).to(0.1, { scale: Vec3.ONE }).start();
    }

    private moveRecord(cardIndex: number, odds: number)
    {
        const duration: number = 0.2;
        const extraCardAmount: number = this.cardList.length - this.screenMaxAmount;
        const lastRecordPos: Vec3 = new Vec3((-extraCardAmount - 1) * (this.cardInterval / 2), this.cardGroup.position.y);
        let targetPosX: number = 0;
        let card: Node = null;
        let operateIcon: Node = null;
        this.roadMapScrollView.scrollToRight(duration);
        tween(this.cardGroup).to(duration, {position: lastRecordPos}).call(() => 
        {
            for (let i: number = 0; i < this.cardList.length; i++)
            {
                card = this.cardList[i];
                targetPosX = card.position.x - this.cardInterval / 2;
                tween(card).to(duration, {position: new Vec3(targetPosX, card.position.y)}).call(() => 
                {
                    tween(this.node).delay(0.1).call(() => 
                    {
                        if (i == this.cardList.length - 1)
                        {
                            this.addCard(cardIndex, odds);
                        }
                    }).start();
                }).start();
            }

            for (let i: number = 0; i < this.operateIconList.length; i++)
            {
                operateIcon = this.operateIconList[i];
                targetPosX = operateIcon.position.x - this.cardInterval / 2;
                tween(operateIcon).to(duration, {position: new Vec3(targetPosX, operateIcon.position.y)}).start();
            }
        }).start();
    }

    public refreshRecord()
    {
        const duration: number = 0.2;
        const targetPos: Vec3 = this.firstCard ? new Vec3(this.firstCard.position.x - this.cardInterval, this.firstCard.position.y) : Vec3.ZERO;
        HiloButtonManager.getInstance().setBetLock(false);
        tween(this.cardGroup).to(duration, { position: Vec3.ZERO }).call(() => 
        {
            this.cardGroup.children.forEach((card: Node) => 
            {
                tween(card).to(duration, { position: targetPos }).start();
            });
        }).delay(duration).call(() => 
        {
            this.initRoadMap();
            tween(this.node).delay(0.05).call(() => 
            {
                this.addRecord(PlayerOperateType.DEFAULT, true);
            }).delay(0.25).call(() => 
            {
                HiloButtonManager.getInstance().setBetLock(true);
            }).start();
        }).start();
    }

    private initRoadMap()
    {
        this.cardList = [];
        this.operateIconList = [];
        this.lastCard = null;
        this.firstCard = null;
        this.bar.position = this.barInitPos;
        this.cardGroup.destroyAllChildren();
        this.cardGroup.getComponent(UITransform).setContentSize(this.cardsGroupInitSize);
        this.cardGroup.getComponent(UIOpacity).opacity = 255;
    }
}
