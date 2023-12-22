import { Sprite, _decorator } from 'cc';
import I18n from '../I18n';
import LocalizedAsset from './LocalizedAsset';

const { ccclass, requireComponent, menu } = _decorator;

@ccclass('LocalizedSprite')
@requireComponent(Sprite)
@menu('Internationalization/LocalizedSprite')
export default class LocalizedSprite extends LocalizedAsset<Sprite> {
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
        this.target.spriteFrame = I18n.Instance.getSpriteFrame(this.key);
    }

    public reset() {
        this.target.spriteFrame = null;
    }

    protected getTarget(): Sprite {
        return this.getComponent(Sprite);
    }
}
