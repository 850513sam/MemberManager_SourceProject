import * as cc from 'cc';

const { ccclass, property, requireComponent, executeInEditMode } = cc._decorator;

export interface IFormatOption {
    displayDecimal: boolean;
    displayDecimalZero: boolean;
    displayLeadingZero: boolean;
    displayThousands: boolean;
    displayZero: boolean;
    maxIntegerLength: number;
    maxDecimalLength: number;
    prefixText: string;
    posfixText: string;
}

@ccclass
@requireComponent(cc.Label)
@executeInEditMode
export default class NumberFormatter extends cc.Component implements IFormatOption {
    @property({ tooltip: '顯示小數' })
    public displayDecimal: boolean = false;

    @property({ tooltip: '小數點不足的位數補0' })
    public displayDecimalZero: boolean = false;

    @property({ tooltip: '整數不足的位數補0' })
    public displayLeadingZero: boolean = false;

    @property({ tooltip: '每三位數加入逗號' })
    public displayThousands: boolean = false;

    @property({ tooltip: '是否顯示0' })
    public displayZero: boolean = false;

    @property({ tooltip: '整數最高位數' })
    public maxIntegerLength: number = 0;

    @property({ tooltip: '小數最高位數' })
    public maxDecimalLength: number = 0;

    @property({ tooltip: '置於最前方的字串' })
    public prefixText: string = '';

    @property({ tooltip: '置於最後方的字串' })
    public posfixText: string = '';

    @property
    public set value(value: number) {
        if (this._value === value) {
            return;
        }
        this._value = value;
        this.updateTextDisplay();
    }
    public get value() {
        return this._value;
    }

    @property
    private _value: number = 0;

    private label: cc.Label = null;

    protected onLoad() {
        this.label = this.getComponent(cc.Label);
    }

    protected start() {
        this.updateTextDisplay();
    }

    public updateTextDisplay() {
        if (!this.enabled) {
            return;
        }
        if (!this.label) {
            return;
        }
        this.label.string = NumberFormatter.format(this.value, {
            displayDecimal: this.displayDecimal,
            displayDecimalZero: this.displayDecimalZero,
            displayLeadingZero: this.displayLeadingZero,
            displayThousands: this.displayThousands,
            displayZero: this.displayZero,
            maxIntegerLength: this.maxIntegerLength,
            maxDecimalLength: this.maxDecimalLength,
            prefixText: this.prefixText,
            posfixText: this.posfixText,
        });
    }

    public static format(value: number, formatOption: Partial<IFormatOption>): string {
        const {
            displayDecimal = false,
            displayDecimalZero = false,
            displayLeadingZero = false,
            displayThousands = false,
            displayZero = false,
            maxIntegerLength = 0,
            maxDecimalLength = 0,
            prefixText = '',
            posfixText = '',
        } = formatOption;

        // fraction part

        // 固定顯示小數點後幾位
        const decimalPointNumber = displayDecimal ? maxDecimalLength : 0;
        const precision = 10 ** decimalPointNumber;
        let precisionValue = value * precision;
        // 去讀小數點誤差
        precisionValue = Math.abs(precisionValue - Math.round(precisionValue)) < 0.000001 ? Math.round(precisionValue) : precisionValue;
        let resultText = (Math.trunc(precisionValue) / precision).toFixed(decimalPointNumber);

        // 清除小數點的 0
        if (!displayDecimalZero) {
            resultText = resultText.replace(/(\d+\.\d*[1-9]|\d+)(\.?0*)/, '$1');
        }

        // integer part

        // 前面添加 0
        if (displayLeadingZero) {
            const integerPart: RegExpMatchArray = resultText.match(/\d+/);
            resultText = resultText.replace(/(\d+)/, `${'0'.repeat(maxIntegerLength - integerPart[0].length)}$1`);
        }

        // general

        // 每三位數加入逗號
        if (displayThousands) {
            const texts: string[] = resultText.split('.');
            resultText = texts[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,') + (texts[1] ? `.${texts[1]}` : '');
        }

        // 是否顯示 0
        if (!displayZero && value === 0) {
            resultText = '';
        }

        if (resultText !== '') {
            resultText = `${prefixText}${resultText}${posfixText}`;
        }

        return resultText;
    }
}
