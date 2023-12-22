
import { Label, SpriteFrame } from 'cc';
import { _decorator, Component, Node, Sprite } from 'cc';
import { StartUp } from '../StartUp';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerCashoutItem
 * DateTime = Fri Mar 24 2023 15:15:54 GMT+0800 (台北標準時間)
 * Author = at259168
 * FileBasename = PlayerCashoutItem.ts
 * FileBasenameNoExtension = PlayerCashoutItem
 * URL = db://assets/scripts/Game/GameObject/PlayerCashoutItem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('PlayerCashoutItem')
export class PlayerCashoutItem extends Component {
    @property(Sprite)
    private icon: Sprite = null;

    @property(Label)
    private id: Label = null;

    @property(SpriteFrame)
    private userIcon: SpriteFrame = null;

    @property(SpriteFrame)
    private localUserIcon: SpriteFrame = null;

    setItem(id: string, isLocalPlayer: boolean) {
        this.icon.spriteFrame = isLocalPlayer ? this.localUserIcon : this.userIcon;
        this.id.string = id;
    }
}
