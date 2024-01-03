import { _decorator, Component, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

export enum EMsgCode
{
    PLAYER_STATUS_ERROR,
    FIND_DATA,
    SAVE_SUCCESSFUL,
}

@ccclass('TipsManager')
export class TipsManager extends Component 
{
    @property(Button)
    private btnClose: Button = null;
    @property(Label)
    private title: Label = null;
    @property(Label)
    private content: Label = null;

    private static instance: TipsManager = null;
    public static getInstance(): TipsManager
    {
        return TipsManager.instance;
    }
    
    protected start() 
    {
        TipsManager.instance = this;
        this.close();
        this.btnClose.node.on(Button.EventType.CLICK, this.onBtnClose.bind(this));
    }

    private onBtnClose()
    {
        this.close();
        this.title.string = "";
        this.content.string = "";

    }

    private getMsg(msgCode: EMsgCode): string
    { 
        switch (msgCode) 
        {
            case EMsgCode.PLAYER_STATUS_ERROR:
                return "人員狀態錯誤";
            case EMsgCode.FIND_DATA:
                return "偵測到儲存資料";
            case EMsgCode.SAVE_SUCCESSFUL:
                return "儲存成功";
        }
    }

    public open(msgCode: EMsgCode, content: string = "")
    {
        this.node.active = true;
        this.title.string = this.getMsg(msgCode);
        this.content.string = content;
    }
    
    private close()
    {
        this.node.active = false;
    }
}
