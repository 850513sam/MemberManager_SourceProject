import { Component } from 'cc';

namespace Delay {
    const component = new Component();
    /**
     * 過了特定時間後，會 fullfill的 promise
     * @param millisecond 指定時間
     */
    export function resolve(millisecond: number): Promise<void> {
        return new Promise<void>((resolveFunc) => {
            component.scheduleOnce(() => {
                resolveFunc();
            }, millisecond / 1000);
        });
    }
    /**
     * 過了特定時間後，會 reject並且回傳指定錯誤原因的 promise
     * @param millisecond 指定時間
     * @param reason 指定錯誤原因
     * @returns
     */
    export function reject<T>(millisecond: number, reason: any): Promise<T> {
        return new Promise<T>((_, rejectFunc) => {
            component.scheduleOnce(() => rejectFunc(reason), millisecond / 1000);
        });
    }

    /**
     * 過了特定時間後，會 fullfill並且回傳指定值的 promise
     * @param millisecond 指定時間
     * @param resolveValue 指定回傳值
     * @returns
     */
    export function value<T>(millisecond: number, resolveValue: T): Promise<T> {
        return new Promise<T>((resolveFunc) => {
            component.scheduleOnce(() => resolveFunc(resolveValue), millisecond / 1000);
        });
    }

    /**
     * 永遠不會 fullfill的 promise
     */
    export function forever(): Promise<never> {
        return new Promise<never>(() => {});
    }
}

export default Delay;
