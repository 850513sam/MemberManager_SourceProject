import { _decorator, Component, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

export enum EMsgCode
{

}

@ccclass('TipsManager')
export class TipsManager extends Component 
{
    @property(Button)
    private btnConfirm: Button = null;
    @property(Label)
    private msg: Label = null;

    private static instance: TipsManager = null;
    public static getInstance(): TipsManager
    {
        return TipsManager.instance;
    }
    
    protected start() 
    {
        TipsManager.instance = this;
        this.close();
        this.btnConfirm.node.on(Button.EventType.CLICK, this.onBtnConfirm.bind(this));
    }

    private onBtnConfirm()
    {

    }

    public setMsg(msgCode: EMsgCode)
    { 
        this.msg.string = "";
    }

    public open()
    {
        this.node.active = true;
    }
    
    private close()
    {
        this.node.active = false;
    }
}
