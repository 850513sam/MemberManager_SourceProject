import { Button, Component, Node, _decorator } from 'cc';

const { ccclass, property } = _decorator;

enum PageEventType {
    OPEN = 'Page::OPEN',
    CLOSE = 'Page::CLOSE',
}

@ccclass('Page')
export default class Page extends Component {
    public static readonly EventType = PageEventType;

    @property(Node)
    public readonly view: Node = null;

    @property(Node)
    public readonly mask: Node = null;

    @property(Button)
    public readonly openButton: Button = null;

    @property(Button)
    public readonly closeButton: Button = null;

    @property
    private readonly closeOnBlur: boolean = false;
    public closeCallBack: Function = null;

    public get isVisible() {
        return this.view.active;
    }

    private _isFreezing = false;

    protected set isFreezing(flag: boolean) {
        this._isFreezing = flag;
    }
    public get isFreezing() {
        return this._isFreezing;
    }

    protected onLoad() {
        this.openButton?.node.on(Button.EventType.CLICK, () => {
            this.open();
        });
        this.closeButton?.node.on(Button.EventType.CLICK, () => {
            if (!this.closeCallBack)
            {
                this.close();
            }
            else
            {
                this.closeCallBack();
            }
        });
        this.mask?.on(Node.EventType.TOUCH_END, () => {
            if (this.closeOnBlur) {
                this.close();
            }
        });
    }

    public async open() {
        if (this.isVisible || this._isFreezing) {
            return;
        }
        this.view.active = true;
        if (this.mask) {
            this.mask.active = true;
        }
        this.node.emit(PageEventType.OPEN);
        await this.playOpenAnimation();
    }

    public async close(isForce = false) {
        if (!this.isVisible || (this._isFreezing && !isForce)) {
            return;
        }
        await this.playCloseAnimation();
        this.view.active = false;
        if (this.mask) {
            this.mask.active = false;
        }
        this.node.emit(PageEventType.CLOSE);
    }

    public waitForOpen() {
        return new Promise((resolve) => {
            this.node.once(Page.EventType.OPEN, resolve);
        });
    }

    public waitForClose() {
        return new Promise((resolve) => {
            this.node.once(Page.EventType.CLOSE, resolve);
        });
    }

    protected playOpenAnimation(): Promise<void> {
        return Promise.resolve();
    }

    protected playCloseAnimation(): Promise<void> {
        return Promise.resolve();
    }
}
