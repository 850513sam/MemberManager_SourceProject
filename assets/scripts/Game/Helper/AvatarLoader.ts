import { assetManager, error, ImageAsset, SpriteFrame } from 'cc';

export default class AvatarLoader {
    private static instance: AvatarLoader = null;

    public static get Instance() {
        if (!this.instance) {
            this.instance = new AvatarLoader();
        }
        return this.instance;
    }

    private constructor() {}

    private cache: { [key: string]: SpriteFrame } = {};

    public async getAvatar(url: string) {
        return (
            this.cache[url] ??
            new Promise<SpriteFrame>((resolve) => {
                assetManager.loadRemote<ImageAsset>(url, { ext: '.png' }, (err, asset) => {
                    if (err) {
                        error(err);
                        return;
                    }
                    const spriteFrame = SpriteFrame.createWithImage(asset);
                    this.cache[url] = spriteFrame;
                    resolve(spriteFrame);
                });
            })
        );
    }
}
