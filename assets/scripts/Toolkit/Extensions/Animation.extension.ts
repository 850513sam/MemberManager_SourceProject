import { Animation } from 'cc';

declare module 'cc' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Animation {
        waitForFinished(animationName?: string): Promise<void>;
    }
}

Animation.prototype.waitForFinished = function waitForFinished(this: Animation, animationName?: string) {
    const animationState = this.getState(animationName);
    if (animationName && !animationState) {
        throw new Error(`Can't find the animation state: ${animationName}`);
    }
    if (!animationState.isPlaying) {
        return Promise.resolve();
    }
    return new Promise((resolve) =>
        this.once(Animation.EventType.FINISHED, () => {
            if (animationState.isPlaying) {
                return;
            }
            resolve();
        })
    );
};
