import { _decorator, Component, Node, Canvas, screen, sys } from 'cc';

const { ccclass, requireComponent } = _decorator;

@ccclass('FullScreenController')
@requireComponent(Canvas)
export class FullScreenController extends Component {
    protected onLoad() {
        if (!sys.isMobile) {
            return;
        }
        this.node.on(
            Node.EventType.TOUCH_END,
            () => {
                if (!screen.fullScreen()) {
                    screen.requestFullScreen();
                }
            },
            this,
            true
        );
    }
}
