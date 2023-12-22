import { Label, Color, labelAssembler, _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GradientLabel')
export class GradientLabel extends Label {
    @property({ type: [Color] })
    private _colors: Color[] = [];

    @property({ type: [Color] })
    public get colors(): Color[] {
        return this._colors;
    }
    public set colors(value: Color[]) {
        this._colors = value;
    }

    protected _flushAssembler() {
        let assembler = Label.Assembler.getAssembler(this);

        if (assembler === ttfAssembler) {
            assembler = gradientAssembler;
        }

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this.material;
            }
        }
    }
}

const ttfAssembler = labelAssembler.getAssembler(Label.prototype);
const gradientAssembler = Object.create(ttfAssembler);
gradientAssembler.fillBuffers = function fillBuffers(comp: GradientLabel) {
    ttfAssembler.fillBuffers.call(gradientAssembler, comp);
    const { renderData } = comp;
    const vData = renderData.chunk.vb;
    for (let colorOffset = 5, i = 0; i < 4; i++, colorOffset += renderData.floatStride) {
        const color = comp.colors[i] || comp.color;
        const colorR = color.r / 255;
        const colorG = color.g / 255;
        const colorB = color.b / 255;
        const colorA = comp.node._uiProps.opacity;
        vData![colorOffset] = colorR;
        vData![colorOffset + 1] = colorG;
        vData![colorOffset + 2] = colorB;
        vData![colorOffset + 3] = colorA;
    }
};
