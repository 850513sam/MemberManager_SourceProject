import { Asset, resources, SpriteFrame } from 'cc';
import AssetCache from './AssetCache';
import CompositeLoadingTask from '../Toolkit/Helper/LoadingTask/CompositeLoadingTask';
import { SupportLanguage } from './Config/support.config';
import { assetPathConfig, cacheableAssetTypeMap, CacheableAssetTypeName } from './Config/assetPath.config';

export default class I18nLoader {
    protected _loadingTask: CompositeLoadingTask = null;

    public get loadingTask() {
        return this._loadingTask;
    }

    public async loadLanguage(language: SupportLanguage, cache: AssetCache): Promise<void> {
        this._loadingTask = new CompositeLoadingTask(`i18n::load-${language}`);
        await Promise.all(
            Object.entries(assetPathConfig).map(async ([assetTypeName, assetPathMap]) => {
                const assetType = cacheableAssetTypeMap[assetTypeName as CacheableAssetTypeName];
                await Promise.all(
                    Object.entries(assetPathMap).map(async ([assetName, path]) => {
                        const asset = await this.loadAsset(language, `${assetTypeName}/${path}`, assetType);
                        cache.set(assetType, assetName, asset);
                    })
                );
            })
        );
    }

    private async loadAsset<T extends typeof Asset>(language: SupportLanguage, path: string, assetType: T): Promise<InstanceType<T>> {
        return this._loadingTask.addSimpleTask(
            `i18n::load-${path}`,
            new Promise<InstanceType<T>>((resolve, reject) => {
                resources.load(`i18n/${language}/${path}${(assetType as any) === SpriteFrame ? '/spriteFrame' : ''}`, assetType, (error, asset) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(asset as InstanceType<T>);
                });
            })
        );
    }
}
