import { Component, _decorator } from 'cc';
import LocalizedComponent from './LocalizedComponent';

const { property } = _decorator;

export default abstract class LocalizedAsset<T extends Component> extends LocalizedComponent {
    @property
    private _key: string = '';

    @property
    public set key(key: string) {
        this._key = key;
        this.onKeyChange();
    }
    public get key(): string {
        return this._key;
    }

    private _target: T = null;

    public get target(): T {
        if (!this._target) {
            this._target = this.getTarget();
        }
        return this._target;
    }
    public set target(component: T) {
        this._target = component;
    }

    public abstract reset(): void;

    protected abstract getTarget(): T;

    protected abstract onKeyChange(): void;

    protected onLanguageChange() {
        this.onKeyChange();
    }
}
