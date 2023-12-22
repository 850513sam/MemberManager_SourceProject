import { Label } from 'cc';

declare module 'cc' {
    interface Label {
        registerTextChangeCallback(callback: (value: string) => string): void;
        unregisterTextChangeCallback(callback: (value: string) => string): void;
        textChangeCallbackList: ((value: string) => string)[];
    }
}

Label.prototype.registerTextChangeCallback = function registerTextChangeCallback(callback: (this: Label, value: string) => string) {
    this.textChangeCallbackList = this.textChangeCallbackList ?? [];
    this.textChangeCallbackList.push(callback);
};

Label.prototype.unregisterTextChangeCallback = function unregisterTextChangeCallback(callback: (this: Label, value: string) => string) {
    const index = this.textChangeCallbackList?.indexOf(callback);
    if (index !== -1) {
        this.textChangeCallbackList.splice(index);
    }
};

const originalDescriptor = Object.getOwnPropertyDescriptor(Label.prototype, 'string');
const originSetter = originalDescriptor.set;
originalDescriptor.set = function set(this: Label, value: string) {
    let finalString: string = value;
    this.textChangeCallbackList?.forEach((callback) => {
        finalString = callback(finalString);
    });
    originSetter.call(this, finalString);
};
Object.defineProperty(Label.prototype, 'string', originalDescriptor);
