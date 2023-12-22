
import { Label, Sprite, SpriteFrame } from 'cc';
import { Color } from 'cc';
import { _decorator, Component, Node } from 'cc';
import NumberFormatter from '../../../Toolkit/Components/NumberFormatter';
import { HexColorCode } from '../../Config/game.config';
import DenomConverter from '../../Helper/DenomConverter';
const { ccclass, property } = _decorator;

@ccclass('PlayerBetInfo')
export class PlayerBetInfo extends Component {
    @property(Label)
    private nickname: Label = null;
    @property(NumberFormatter)
    private betValue: NumberFormatter = null;
    @property(NumberFormatter)
    private multiplierValue: NumberFormatter = null;
    @property(Sprite)
    private background: Sprite = null;
    @property(SpriteFrame)
    private betFrame: SpriteFrame = null;
    @property(SpriteFrame)
    private cashoutFrame: SpriteFrame = null;

    private _wager: number;
    private _ID: number;

    public get wager() {
        return this._wager;
    }
    public get ID() {
        return this._ID
    };


    public setInfo(nickname: string, betValue: number, multiplier: number, wager: number, id: number) {
        this.nickname.string = nickname;
        this.betValue.value = multiplier === 0 ? betValue : betValue * multiplier / 100;
        this._wager = wager;
        this._ID = id;

        if (multiplier !== 0) {
            this.background.spriteFrame = this.cashoutFrame;
            this.nickname.color = new Color(HexColorCode.Brown);
            this.betValue.getComponent(Label).color = new Color(HexColorCode.Black);
            this.multiplierValue.enabled = true;
            this.multiplierValue.value = multiplier / 100;
            this.multiplierValue.getComponent(Label).color = new Color(HexColorCode.Brown);
        }
        else {
            this.background.spriteFrame = this.betFrame;
            this.nickname.color = new Color(HexColorCode.White);
            this.betValue.getComponent(Label).color = new Color(HexColorCode.Yellow);
            this.multiplierValue.enabled = false;
            this.multiplierValue.getComponent(Label).string = `?`;
            this.multiplierValue.getComponent(Label).color = new Color(HexColorCode.White);
        }
    }

    public setCashout(bet: number, multiplier: number) {
        this.betValue.value = DenomConverter.valueToDollar(bet * multiplier / 100);
        this.background.spriteFrame = this.cashoutFrame;
        this.nickname.color = new Color(HexColorCode.Brown);
        this.betValue.getComponent(Label).color = new Color(HexColorCode.Black);
        this.multiplierValue.enabled = true;
        this.multiplierValue.value = multiplier / 100;
        this.multiplierValue.getComponent(Label).color = new Color(HexColorCode.Brown);
    }
}