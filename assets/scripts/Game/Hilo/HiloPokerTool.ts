import { SpriteAtlas } from "cc";
import { Node } from "cc";
import { tween } from "cc";
import { Vec3 } from "cc";
import { Sprite } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";
import AudioManager from "../AudioManager";
import { SoundEffect as SoundEffect } from "../Config/audio.config";

const { ccclass, property } = _decorator;
@ccclass('HiloPokerTool')
export class HiloPokerTool extends Component 
{
    @property(SpriteAtlas)
    private pokerAtlas: SpriteAtlas = null;

    private static instance: HiloPokerTool = null;
    public static getInstance(): HiloPokerTool 
    {
        if (!HiloPokerTool.instance)
        {
            HiloPokerTool.instance = new HiloPokerTool();
        }
        return HiloPokerTool.instance;
    }

    public setPokeAtlas(pokerAtlas: SpriteAtlas)
    {
        this.pokerAtlas = pokerAtlas;
    }

    public getPoker(pokerNode: Node, cardIndex: number): Node
    {
        let pokerSprite: Sprite = pokerNode.getComponent(Sprite);
        let spriteName: string = "";
        if (!pokerSprite)
        {
            pokerNode.addComponent(Sprite);
        }
        spriteName = this.convertCardIndexToSpriteName(cardIndex);
        pokerSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(spriteName);
        return pokerNode;
    }

    private convertCardIndexToSpriteName(cardIndex: number): string
    {
        let spriteName: string = "img_poker_0";
        spriteName += cardIndex == -1 ? "53" : this.convertCardIndexFormat(cardIndex);
        return spriteName;
    }

    private convertCardIndexFormat(cardIndex: number): string
    {
        let result: string = "";
        let cardIndexStr: string = cardIndex.toString();
        result = cardIndex >= 10 ? cardIndexStr : "0" + cardIndexStr;
        return result;
    }

    public turnCardOver(poker: Node, cardIndex: number)
    {
        AudioManager.Instance.playEffect(SoundEffect.FLIP);
        let duration: number = 0.3;
        poker = this.getPoker(poker, -1);
        tween(poker).to(duration, {scale: new Vec3(0, poker.scale.y)})
        .call(() => 
        {
            poker = this.getPoker(poker, cardIndex);
        })
        .to(duration, {scale: new Vec3(poker.scale.x, poker.scale.y)}).start();
    }

    public getPokerValue(cardIndex: number): number
    {
        if (cardIndex <= 0 || cardIndex > 52)
        {
            return 0;
        }
        let remainder = cardIndex % 13;
        let value: number = remainder == 0 ? 13 : remainder;
        return value;
    }
}
