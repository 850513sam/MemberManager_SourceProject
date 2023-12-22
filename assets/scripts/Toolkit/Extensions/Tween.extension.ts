import { Tween } from 'cc';

declare module 'cc' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Tween<T> {
        promisifyStart(startTime?: number): Promise<void>;
        /** set tween state to specific timing */
        setTime(time: number): void;
    }
}

Tween.prototype.promisifyStart = function promisifyStart(this: Tween<any>, startTime: number = 0) {
    return new Promise((resolve) => this.call(resolve).start().setTime(startTime));
};

Tween.prototype.setTime = function setTime(time: number) {
    this._finalAction._firstTick = false;
    this._finalAction._elapsed = time;
};
