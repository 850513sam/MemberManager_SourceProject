import { Label, _decorator } from 'cc';
import I18n from '../I18n';
import LocalizedAsset from './LocalizedAsset';
import { fillTextArgument } from '../../Toolkit/Utils/Utility';

const { ccclass, requireComponent, menu } = _decorator;

@ccclass('LocalizedLabel')
@requireComponent(Label)
@menu('Internationalization/LocalizedLabel')
export default class LocalizedLabel extends LocalizedAsset<Label> {
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
        const [messageKey, ...messageArgs] = this.key.split('|');
        this.target.string = fillTextArgument(I18n.Instance.getMessage(messageKey) ?? messageKey, messageArgs);
    }

    public reset() {
        this.target.string = '';
    }

    protected getTarget(): Label {
        return this.getComponent(Label);
    }
}
