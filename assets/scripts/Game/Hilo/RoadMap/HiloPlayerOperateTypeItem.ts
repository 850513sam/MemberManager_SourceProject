import { Sprite } from "cc";
import { SpriteFrame } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";

const { ccclass } = _decorator;
@ccclass('HiloPlayerOperateTypeItem')
export class HiloPlayerOperateTypeItem extends Component
{
    public setSprite(spriteFrame: SpriteFrame)
    {
        let sprite: Sprite = this.node.getComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
    }
}
