import { Asset, JsonAsset } from 'cc';

export enum CacheableAssetTypeName {
    JSON = 'json',
}

export const cacheableAssetTypeMap: Record<CacheableAssetTypeName, typeof Asset> = {
    json: JsonAsset,
};

export const assetPathConfig: Record<CacheableAssetTypeName, Record<string, string>> = {
    json: {
        errorMessage: 'errorMessage',
        text: 'text',
        nodeSetting: 'nodeSetting',
    },
};
