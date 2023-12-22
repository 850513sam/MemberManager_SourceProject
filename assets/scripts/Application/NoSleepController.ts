import { _decorator, Component, Node, Canvas, sys } from 'cc';
import Nosleep from 'nosleep.js';

const { ccclass, requireComponent } = _decorator;
let noSleep: Nosleep;
if (sys.isMobile) {
    noSleep = new Nosleep();
}

@ccclass('NoSleepController')
@requireComponent(Canvas)
export class NoSleepController extends Component {
    protected onLoad() {
        if (!sys.isMobile || noSleep.isEnabled) {
            return;
        }
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this, true);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this, true);
    }

    private _onTouchEnd() {
        noSleep.enable().then(() => {
            this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this, true);
        });
    }
}
