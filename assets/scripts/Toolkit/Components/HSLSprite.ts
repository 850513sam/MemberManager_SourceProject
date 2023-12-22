import { Material, Sprite, Vec3, _decorator } from 'cc';

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('HSLSprite')
@executeInEditMode
export default class HSLSprite extends Sprite {
    @property({ min: -180, max: 180, step: 1, slide: true })
    public set hue(value: number) {
        if (this._hsl.x === value) {
            return;
        }
        this._hsl.x = value;
        this.updateHueProperty();
    }
    public get hue() {
        return this._hsl.x;
    }

    @property({ min: -100, max: 100, step: 1, slide: true })
    public get saturation(): number {
        return this._hsl.y;
    }
    public set saturation(value: number) {
        if (this._hsl.y === value) {
            return;
        }
        this._hsl.y = value;
        this.updateSaturationProperty();
    }

    @property({ min: -100, max: 100, step: 1, slide: true })
    public get lightness(): number {
        return this._hsl.z;
    }
    public set lightness(value: number) {
        if (this._hsl.z === value) {
            return;
        }
        this._hsl.z = value;
        this.updateLightnessProperty();
    }

    private _hsl: Vec3 = Vec3.ZERO.clone();

    public get hsl(): Readonly<Vec3> {
        return this._hsl.clone();
    }
    public set hsl(value: Vec3) {
        if (this._hsl.equals(value)) {
            return;
        }
        this._hsl.set(value);
        this.updateHSLProperty();
    }

    protected _onMaterialModified(idx: number, material: Material) {
        super._onMaterialModified(idx, material);
        if (material) {
            this.updateHSLProperty();
        }
    }

    private updateHSLProperty() {
        this.updateHueProperty();
        this.updateSaturationProperty();
        this.updateLightnessProperty();
    }

    private updateHueProperty() {
        this.getMaterialInstance(0).setProperty('hue', this._hsl.x);
    }

    private updateSaturationProperty() {
        this.getMaterialInstance(0).setProperty('saturation', (this._hsl.y + 100) / 100);
    }

    private updateLightnessProperty() {
        this.getMaterialInstance(0).setProperty('lightness', (this._hsl.z + 100) / 100);
    }
}
