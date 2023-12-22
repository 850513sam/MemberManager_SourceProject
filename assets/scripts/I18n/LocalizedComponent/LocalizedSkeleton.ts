import { sp, _decorator } from 'cc';
import I18n from '../I18n';
import LocalizedAsset from './LocalizedAsset';

const { ccclass, requireComponent, menu } = _decorator;

@ccclass('LocalizedSkeleton')
@requireComponent(sp.Skeleton)
@menu('Internationalization/LocalizedSkeleton')
export default class LocalizedSkeleton extends LocalizedAsset<sp.Skeleton> {
    protected async onKeyChange(): Promise<void> {
        if (!this.target) {
            throw new Error("Target can't be empty");
        }
        if (!I18n.Instance.currentLanguage) {
            if (I18n.Instance.isLoadingLanguage) {
                await I18n.Instance.waitForLanguageLoaded();
            } else {
                throw new Error('Set current language first');
            }
        }
        const skeletonData = I18n.Instance.getSkeletonData(this.key);
        if (skeletonData) {
            const state = this.target.getState();
            this.target.skeletonData = skeletonData;
            if (state) {
                state.tracks.forEach((track) => {
                    const {
                        trackIndex,
                        loop,
                        trackTime,
                        animation: { name: animationName },
                    } = track;
                    this.target.setAnimation(trackIndex, animationName, loop).trackTime = trackTime;
                });
            }
        }
    }

    public reset() {
        this.target.skeletonData = null;
    }

    protected getTarget(): sp.Skeleton {
        return this.getComponent(sp.Skeleton);
    }
}
