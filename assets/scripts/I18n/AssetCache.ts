import { Asset } from 'cc';

export default class AssetCache {
    private assetCache: Map<typeof Asset, Record<string, Asset>> = new Map();

    public set<T extends typeof Asset>(type: T, key: string, asset: InstanceType<T>) {
        if (!this.assetCache.has(type)) {
            this.assetCache.set(type, {});
        }
        const assetMap = this.assetCache.get(type);
        assetMap[key] = asset;
    }

    public get<T extends typeof Asset>(type: T, key: string): InstanceType<T> {
        if (!this.assetCache.has(type)) {
            this.assetCache.set(type, {});
        }
        const assetMap = this.assetCache.get(type);
        return assetMap[key] as InstanceType<T>;
    }
}
