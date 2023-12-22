import { Vec3, _decorator } from 'cc';
import I18n from '../I18n';
import LocalizedAsset from './LocalizedAsset';
import { Node } from 'cc';

const { ccclass, menu } = _decorator;

@ccclass('LocalizedPosition')
@menu('Internationalization/LocalizedPosition')
export default class LocalizedPosition extends LocalizedAsset<any> {
    private positionData: Array<string> = new Array<string>();
    private positionX: number = 0;
    private positionY: number = 0;
    private positionKey: string = "";
    private position: Vec3 = new Vec3();

    public reset() 
    {
        this.target = null;
        this.positionData = null;
    }

    protected getTarget(): Node {
        return this.node;
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

        this.positionKey = `${this.node.name}-Position`
        this.positionData = I18n.Instance.getNodeSetting(this.positionKey).split(",");
        this.positionX = Number(this.positionData[0]);
        this.positionY = Number(this.positionData[1]);
        this.position.set(this.positionX, this.positionY);
        if (this.positionData && !Number.isNaN(this.positionX) && !Number.isNaN(this.positionY)) 
        {
            this.target.position = this.position;
        }
        else
        {
            throw new Error(`Position data error, node name : ${this.node.name} `);
        }
    }
}
