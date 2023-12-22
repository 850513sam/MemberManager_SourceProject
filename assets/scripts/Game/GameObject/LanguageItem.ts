import { Color, Component, Label, Node, Toggle, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LanguageItem')
export class LanguageItem extends Component 
{
    @property(Label)
    private languageName: Label = null;
    @property(Node)
    private line: Node = null;
    @property(Toggle)
    private toggle: Toggle = null;

    protected onLoad()
    {
        this.toggle.isChecked = false;
    }

    public setLanguageName(name: string)
    {
        this.languageName.string = name;
    }

    public setLineActive(active: boolean)
    {
        this.line.active = active;
    }

    public setColor(color: Color)
    {
        this.languageName.color = color;
    }

    public getToggle(): Toggle
    {
        return this.toggle;
    }
}
