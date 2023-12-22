import { Component, _decorator } from 'cc';
import I18n from '../I18n';

const { executionOrder } = _decorator;

@executionOrder(-1)
export default abstract class LocalizedComponent extends Component {
    protected onLoad() {
        I18n.Instance.on(I18n.EVENT_TYPE.LanguageChanged, this.onLanguageChange, this);
    }

    protected start() {
        this.onLanguageChange();
    }

    protected onDestroy() {
        I18n.Instance.targetOff(this);
    }

    protected abstract onLanguageChange(): void;
}
