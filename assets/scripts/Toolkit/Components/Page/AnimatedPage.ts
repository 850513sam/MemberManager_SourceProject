import { tween, UITransform, Vec3 } from 'cc';
import { UIOpacity, _decorator } from 'cc';
import Page from './Page';

const { ccclass, property } = _decorator;

@ccclass('AnimatedPage')
export default class AnimatedPage extends Page {

    @property(UITransform)
    private referenceBackground: UITransform = null;    // view 這個 node 的長寬目前是固定(100, 100)，因此需要透過 referenceBackground 來知道整個彈窗的長寬

    protected onLoad() {
        super.onLoad();
    }

    protected async playOpenAnimation(): Promise<void> {
        this.isFreezing = true;
        tween(this.mask.getComponent(UIOpacity))
            .set({ opacity: 0 })
            .to(0.3, { opacity: 255 })
            .start();
        await tween(this.view)
            .set({ position: new Vec3(0, -this.referenceBackground.contentSize.height, 0) })
            .to(0.3, { position: Vec3.ZERO }, { easing: 'smooth' })
            .promisifyStart();
        this.isFreezing = false;
    }

    protected async playCloseAnimation(): Promise<void> {
        this.isFreezing = true;
        tween(this.mask.getComponent(UIOpacity))
            .to(0.3, { opacity: 0 })
            .start();
        await tween(this.view)
            .to(0.3, { position: new Vec3(0, -this.referenceBackground.contentSize.height, 0) }, { easing: 'smooth' })
            .promisifyStart();
        this.isFreezing = false;
    }
}
