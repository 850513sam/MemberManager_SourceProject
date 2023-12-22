// eslint-disable-next-line max-classes-per-file
import { Button, Vec3, _decorator, __private } from 'cc';
import { EDITOR } from 'cc/env';
import HSLSprite from './HSLSprite';

const { ccclass, property } = _decorator;

@ccclass('CustomButtonStatus')
class CustomButtonStatus {
    @property(Vec3)
    hsl = Vec3.ZERO.clone();
    @property(Vec3)
    scale = Vec3.ONE.clone();

    constructor();
    constructor(hsl?: Vec3, scale?: Vec3);
    constructor(hsl?: Vec3, scale?: Vec3) {
        this.hsl = hsl ?? Vec3.ZERO.clone();
        this.scale = scale ?? Vec3.ONE.clone();
    }

    public equal(status: CustomButtonStatus) {
        return this.hsl.equals(status.hsl) && this.scale.equals(status.scale);
    }

    public static lerp(out: CustomButtonStatus, from: CustomButtonStatus, to: CustomButtonStatus, ratio: number): void {
        Vec3.lerp(out.hsl, from.hsl, to.hsl, ratio);
        Vec3.lerp(out.scale, from.scale, to.scale, ratio);
    }
}

const tempStatus = new CustomButtonStatus();

@ccclass('CustomButton')
export default class CustomButton extends Button {
    @property(CustomButtonStatus)
    private _normalStatus: CustomButtonStatus = new CustomButtonStatus();

    @property(CustomButtonStatus)
    private _pressedStatus: CustomButtonStatus = new CustomButtonStatus();

    @property(CustomButtonStatus)
    private _hoverStatus: CustomButtonStatus = new CustomButtonStatus();

    @property(CustomButtonStatus)
    private _disabledStatus: CustomButtonStatus = new CustomButtonStatus();

    @property
    get transitionDuration() {
        return this._duration;
    }
    set transitionDuration(value) {
        if (this._duration === value) {
            return;
        }
        this._duration = value;
    }

    @property({ override: true, visible: false })
    public set transition(_: __private._cocos_ui_button__Transition) {}
    public get transition() {
        return this._transition;
    }

    @property(CustomButtonStatus)
    public get normalStatus() {
        return this._normalStatus;
    }
    public set normalStatus(value: CustomButtonStatus) {
        if (this._normalStatus?.equal(value)) {
            return;
        }
        this._normalStatus = value;
        this._updateState();
    }

    @property(CustomButtonStatus)
    public get pressedStatus(): CustomButtonStatus {
        return this._pressedStatus;
    }
    public set pressedStatus(value: CustomButtonStatus) {
        if (this._pressedStatus.equal(value)) {
            return;
        }
        this._pressedStatus = value;
    }

    @property(CustomButtonStatus)
    public get hoverStatus(): CustomButtonStatus {
        return this._hoverStatus;
    }
    public set hoverStatus(value: CustomButtonStatus) {
        if (this._hoverStatus.equal(value)) {
            return;
        }
        this._hoverStatus = value;
    }

    @property(CustomButtonStatus)
    public get disabledStatus(): CustomButtonStatus {
        return this._disabledStatus;
    }
    public set disabledStatus(value: CustomButtonStatus) {
        if (this._disabledStatus.equal(value)) {
            return;
        }
        this._disabledStatus = value;
        this._updateState();
    }

    private _hslSprite: HSLSprite = null;

    private _transitionFinished = true;
    private _time = 0;
    private _pressed = false;
    private _hovered = false;
    private _fromStatus: CustomButtonStatus = new CustomButtonStatus();
    private _toStatus: CustomButtonStatus = new CustomButtonStatus();

    get interactable() {
        return this._interactable;
    }

    set interactable(value) {
        this._interactable = value;
        this._updateState();

        if (!this._interactable) {
            this._pressed = false;
            this._hovered = false;
        }
    }

    public update(dt: number) {
        if (this._transitionFinished || !this.target || this._fromStatus.equal(this._toStatus)) {
            return;
        }
        const hslAdjustor = this.target.getComponent(HSLSprite);
        if (!hslAdjustor) {
            return;
        }

        this._time += dt;
        let ratio = 1.0;
        if (this._duration > 0) {
            ratio = this._time / this._duration;
        }

        if (ratio >= 1) {
            ratio = 1;
        }

        CustomButtonStatus.lerp(tempStatus, this._fromStatus, this._toStatus, ratio);
        this.applyButtonStatus(tempStatus);

        if (ratio === 1) {
            this._transitionFinished = true;
        }
    }

    protected _applyTarget() {
        if (this.target) {
            super._applyTarget();
            this._hslSprite = this.target.getComponent(HSLSprite);
        }
    }

    protected _resetState() {
        super._resetState();
        this.applyButtonStatus(this._interactable ? this._normalStatus : this._disabledStatus);
    }

    protected _applyTransition(state: string) {
        this._updateCustomTransition(state);
    }

    protected _updateCustomTransition(state: string) {
        if (!this._hslSprite) {
            return;
        }

        if (EDITOR) {
            this.applyButtonStatus(this[`${state}Status`]);
        } else {
            this._fromStatus = new CustomButtonStatus(this._hslSprite.hsl, this.target.getScale());
            this._toStatus = this[`${state}Status`];
            this._time = 0;
            this._transitionFinished = false;
        }
    }

    private applyButtonStatus(status: CustomButtonStatus) {
        if (!this.target) {
            return;
        }
        if (!this._hslSprite) {
            return;
        }

        // HSL
        this._hslSprite.hsl = status.hsl;

        // scale
        this.target.setScale(status.scale);
    }
}
