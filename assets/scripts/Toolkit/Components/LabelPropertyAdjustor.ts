// eslint-disable-next-line max-classes-per-file
import { Component, Label, _decorator } from 'cc';
import { getLocaleStringLength } from '../Utils/Utility';

const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('FontSizeConstraint')
class LabelPropertyConstraint {
    @property
    public digit: number = 0;

    @property
    public fontSize: number = 0;

    @property
    public lineHeight: number = 0;
}

@ccclass('LabelPropertyAdjustor')
@requireComponent(Label)
@executeInEditMode
export default class LabelPropertyAdjustor extends Component {
    @property([LabelPropertyConstraint])
    private constraints: LabelPropertyConstraint[] = [];

    private label: Label = null;

    private previousDigit = 0;

    protected onLoad() {
        this.label = this.getComponent(Label);
        this.label.registerTextChangeCallback((str) => {
            this.updateFontSize(str);
            return str;
        });
        this.constraints.sort((a, b) => b.digit - a.digit);
    }

    protected start() {
        this.updateFontSize(this.label.string);
    }

    private updateFontSize(str: string) {
        const currentDigit = getLocaleStringLength(str.replace(/[.|,]/g, ''));
        if (currentDigit === this.previousDigit) {
            return;
        }
        this.previousDigit = currentDigit;
        for (let i = 0; i < this.constraints.length; i++) {
            const constraint = this.constraints[i];
            if (currentDigit >= constraint.digit) {
                this.label.fontSize = constraint.fontSize;
                this.label.lineHeight = constraint.lineHeight;
                break;
            }
        }
    }
}
