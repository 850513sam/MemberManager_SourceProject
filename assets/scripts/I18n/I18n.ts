import { EventTarget, JsonAsset, sp, SpriteAtlas, SpriteFrame, warn } from 'cc';
import AssetCache from './AssetCache';
import I18nLoader from './I18nLoader';
import { SupportLanguage } from './Config/support.config';
import { fallbackLanguages } from './Config/fallback.config';
import { ILocaleDataSet } from './I18n.type';

enum I18nEventType {
    LanguageChanged = 'LanguageChanged',
}

export default class I18n extends EventTarget {
    public static readonly EVENT_TYPE = I18nEventType;
    private static instance: I18n = null;
    private readonly caches: Partial<ILocaleDataSet<AssetCache>> = {};
    private readonly loader: I18nLoader = new I18nLoader();
    private readonly defaultLanguage: SupportLanguage = SupportLanguage.EN;
    private _currentLanguage: SupportLanguage = null;
    private _loadLanguagePromise: Promise<void> = null;

    private constructor() {
        super();
    }

    public static get Instance() {
        if (!this.instance) {
            this.instance = new I18n();
        }
        return this.instance;
    }

    public get currentLanguage() {
        return this._currentLanguage;
    }

    public get currentLanguageForWebview() 
    {
        switch (this._currentLanguage) 
        {
            //例外處理
            case SupportLanguage.SCH:
                return 'zh-chs';
            case SupportLanguage.TCH:
                return 'zh-cht';

            default:
                return this._currentLanguage.toString();
        }
    }

    public get loadingTask() {
        return this.loader.loadingTask;
    }

    private get cache() {
        return this.caches[this._currentLanguage];
    }
    private set cache(assetCache: AssetCache) {
        this.caches[this._currentLanguage] = assetCache;
    }

    public get isLoadingLanguage() {
        return !!this._loadLanguagePromise;
    }

    /**
     * 改變當前遊戲語言
     * @param language 要使用的遊戲語言
     */
    public async changeLanguage(language: string) {
        if (this.isLoadingLanguage) {
            await this._loadLanguagePromise;
        }
        if (!language || language === this._currentLanguage) {
            return;
        }
        const targetLanguage: SupportLanguage = SupportLanguage.contains(language) ? language : this.getFallbackLanguage(language);
        this.handleTitleTranlation(targetLanguage);
        if (!this.caches[targetLanguage]) {
            this.caches[targetLanguage] = new AssetCache();
            this._loadLanguagePromise = this.loader.loadLanguage(targetLanguage, this.caches[targetLanguage]);
            await this._loadLanguagePromise;
            this._loadLanguagePromise = null;
        }
        this._currentLanguage = targetLanguage;
        this.emit(I18n.EVENT_TYPE.LanguageChanged);
    }

    public waitForLanguageLoaded() {
        if (this._loadLanguagePromise) {
            return this._loadLanguagePromise;
        }
        return Promise.resolve();
    }

    /**
     * 取得多語系物件資訊
     * @param key 
     * @returns 
     */
    public getNodeSetting(key: string): string {
        const data = { ...this.cache.get(JsonAsset, 'nodeSetting')?.json };
        const result: string = data[key];
        if (!result) {
            warn(`Can't find data : ${key} in language: ${this._currentLanguage}`);
        }
        return result;
    }

    /**
     * 將要顯示的訊息翻譯成目標語言
     * @param key 要顯示的訊息
     * @returns 翻譯後文本
     */
    public getMessage(key: string): string {
        const messages = { ...this.cache.get(JsonAsset, 'errorMessage').json, ...this.cache.get(JsonAsset, 'text')?.json};
        const resultMessage: string = messages[key];
        if (!resultMessage) {
            warn(`Can't find message: ${key} in language: ${this._currentLanguage}`);
        }
        return resultMessage;
    }

    /**
     * 根據目標圖片取得當前語言中對應的 spriteFrame
     * @param key 目標圖片鍵
     */
    public getSpriteFrame(key: string): SpriteFrame {
        const [a, b] = key.split('@');
        let resultSpriteFrame: SpriteFrame = null;
        if (b) {
            const spriteAtlas = this.cache.get(SpriteAtlas, a);
            if (!spriteAtlas) {
                warn(`Can't find spriteAtlas: ${a} in language: ${this._currentLanguage}`);
            } else {
                resultSpriteFrame = spriteAtlas.getSpriteFrame(b);
            }
        } else {
            resultSpriteFrame = this.cache.get(SpriteFrame, a);
        }
        if (!resultSpriteFrame) {
            warn(`Can't find spriteFrame: ${key} in language: ${this._currentLanguage}`);
        }
        return resultSpriteFrame;
    }

    public getSkeletonData(key: string): sp.SkeletonData {
        const resultSkeletonData = this.cache.get(sp.SkeletonData, key);
        if (!resultSkeletonData) {
            warn(`Can't find skeleton data: ${key} in language: ${this._currentLanguage}`);
        }
        return resultSkeletonData;
    }

    private handleTitleTranlation(targetLanguage: SupportLanguage) {
        document.title = 'Hilo';
    }

    /**
     * 取得替代語言
     * @param language 要被替換掉的語言
     */
    public getFallbackLanguage(language: string): SupportLanguage {
        const fallBackLanguage = fallbackLanguages[language];
        if (!fallBackLanguage) {
            return this.defaultLanguage;
        }
        if (SupportLanguage.contains(fallBackLanguage)) {
            return fallBackLanguage;
        }
        return this.getFallbackLanguage(fallBackLanguage);
    }
}
