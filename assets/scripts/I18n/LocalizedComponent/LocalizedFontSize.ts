import { Label, _decorator } from 'cc';
import I18n from '../I18n';
import LocalizedAsset from './LocalizedAsset';

const { ccclass, requireComponent, menu } = _decorator;

@ccclass('LocalizedFontSize')
@requireComponent(Label)
@menu('Internationalization/LocalizedFontSize')
export default class LocalizedFontSize extends LocalizedAsset<Label> {
    private fontSize: number = 0;
    private fontSizeKey: string = "";

    public reset() 
    {
        this.target.string = '';
    }

    protected getTarget(): Label {
        return this.getComponent(Label);
    }

    protected async onKeyChange(): Promise<void>
    {
        if (!this.target) 
        {
            throw new Error("Target can't be empty");
        }

        if (!I18n.Instance.currentLanguage) 
        {
            if (I18n.Instance.isLoadingLanguage) 
            {
                await I18n.Instance.waitForLanguageLoaded();
            } 
            else 
            {
                throw new Error('Set current language first');
            }
        }

        this.fontSizeKey = `${this.node.name}-FontSize`;
        this.fontSize = Number(I18n.Instance.getNodeSetting(this.fontSizeKey));
        if (this.fontSize)
        {
            this.target.fontSize = this.fontSize;
            this.target.lineHeight = this.fontSize;
        }
        else
        {
            throw new Error(`Font size data error, node name : ${this.node.name} `);
        }
    }
}
