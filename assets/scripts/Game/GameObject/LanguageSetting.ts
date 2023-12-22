import { Color, instantiate, Node, Prefab, Size, UITransform, Vec3, _decorator } from 'cc';
import { SupportLanguage } from '../../I18n/Config/support.config';
import I18n from '../../I18n/I18n';
import AnimatedPage from '../../Toolkit/Components/Page/AnimatedPage';
import { HexColorCode } from '../Config/game.config';
import { LanguageItem } from './LanguageItem';
const { ccclass, property } = _decorator;

@ccclass('LanguageSetting')
export class LanguageSetting extends AnimatedPage 
{
    @property(UITransform)
    private content: UITransform = null;
    @property(Prefab)
    private item: Prefab = null;

    private readonly itemHeight: number = 100;
    private readonly whiteColor: Color = new Color(HexColorCode.White);
    private readonly yellowColor: Color = new Color(HexColorCode.Yellow);
    private readonly languageName: string[] = 
    [
        'English',
        '简体中文',
        '繁體中文',
        'Tiếng Việt',
        '日本語',
        'Español',
        'Português',
        '조선말',
        'Bahasa Indonesia',
        'ไทย',
    ];

    private supportLanguageNameList: string[] = [];
    private languageItemList: LanguageItem[] = [];
    //重複利用記憶體
    private isChoose: boolean = false;
    private labelColor: Color = new Color();

    protected onLoad() 
    {
        super.onLoad();
        this.getSupportLanguageName();
        this.initOptionsPage();
    }
    
    public async open() 
    {
        super.open();
    }
    
    private getSupportLanguageName()
    {
        const supportLanguageValue = Object.values(SupportLanguage);
        for (let i = 0; i < supportLanguageValue.length; i++)
        {
            this.supportLanguageNameList.push(supportLanguageValue[i].toString());
        }
    }

    private initOptionsPage()
    {
        const count: number = Object.keys(SupportLanguage).length;
        let item: Node = null;
        let position: Vec3 = new Vec3();
        let languageItem: LanguageItem = null;
        this.content.setContentSize(new Size(720, this.itemHeight * count));

        //add option
        for (let i = 0; i < count; i++)
        {
            this.isChoose = this.getIsChoose(i);
            this.labelColor = this.getLanguageNameColor();
            position.set(0, i * this.itemHeight * -1 - 25);
            item = instantiate(this.item);
            item.setParent(this.content.node);
            item.position = position;
            item.name = this.languageName[i];
            languageItem = item.getComponent(LanguageItem);
            languageItem.setLanguageName(this.languageName[i]);
            languageItem.setLineActive(i != count - 1);
            languageItem.setColor(this.labelColor);
            this.languageItemList.push(languageItem);

            //add toggle event
            languageItem.getToggle().node.on('toggle', async () => 
            {
                await I18n.Instance.changeLanguage(this.supportLanguageNameList[i]);
                this.changeState();
            });
        }
        this.changeState();
    }

    private getCurrentLanguageIndex(): number
    {
        for (let i = 0; i < this.supportLanguageNameList.length; i++)
        {
            if (I18n.Instance.currentLanguage.toString() == this.supportLanguageNameList[i])
            {
                return i;
            }
        }

        //理論上不會執行到這 以防萬一還是return預設的越南語系
        return 3;
    }

    private getIsChoose(chooseIndex: number): boolean
    {
        return this.getCurrentLanguageIndex() == chooseIndex;
    }

    private getLanguageNameColor(): Color
    {
        return this.isChoose ? this.yellowColor : this.whiteColor;
    }

    private changeState()
    {
        for (let i = 0; i < this.languageItemList.length; i++)
        {
            this.isChoose = this.getIsChoose(i);
            this.labelColor = this.getLanguageNameColor();
            this.languageItemList[i].setColor(this.labelColor);
            this.languageItemList[i].getToggle().isChecked = this.isChoose;
        }
    }
}
