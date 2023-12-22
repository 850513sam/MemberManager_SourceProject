import { Button, _decorator } from 'cc';
import Page from './Page';

const { ccclass, property } = _decorator;

enum DialogEventType {
    Confirm = 'Confirm',
    Cancel = 'Cancel',
}

@ccclass('Dialog')
export default class Dialog extends Page {
    public static readonly EventType = Object.assign(DialogEventType, Page.EventType);

    @property(Button)
    public readonly confirmButton: Button = null;

    @property(Button)
    public readonly cancelButton: Button = null;

    @property
    private readonly closeOnConfirm = true;

    @property
    private readonly closeOnCancel = true;

    protected onLoad(): void {
        super.onLoad();
        this.confirmButton.node.on(Button.EventType.CLICK, () => {
            this.onConfirmButtonClick();
        });
        this.cancelButton?.node.on(Button.EventType.CLICK, () => {
            this.onCancelButtonClick();
        });
    }

    public waitForComfirm() {
        return new Promise((resolve) => {
            this.node.once(Dialog.EventType.Confirm, resolve);
        });
    }

    public waitForCancel() {
        return new Promise((resolve) => {
            this.node.once(Dialog.EventType.Cancel, resolve);
        });
    }

    protected onConfirmButtonClick() {
        this.node.emit(Dialog.EventType.Confirm);
        if (this.closeOnConfirm) {
            this.close();
        }
    }

    protected onCancelButtonClick() {
        this.node.emit(Dialog.EventType.Cancel);
        if (this.closeOnCancel) {
            this.close();
        }
    }
}
