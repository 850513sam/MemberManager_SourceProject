
import { _decorator, Component, Node, WebView } from 'cc';
import Application from '../../Application/Application';
import I18n from '../../I18n/I18n';
import AudioManager from '../AudioManager';
import { SoundEffect } from '../Config/audio.config';
import { StartUp } from '../StartUp';
import { PlayerInfo } from '../PlayerInfo';
const { ccclass, property } = _decorator;

@ccclass('UserWebview')
export class UserWebview extends Component {
    @property(WebView)
    private webview: WebView = null;

    protected onLoad() {
        window.addEventListener("message", (event) => {
            if (event.source == this.webview.nativeWebView?.contentWindow) {
                const data: { Path: string; Data: string } = JSON.parse(event.data);
                if (data.Path == "history.loaded" && data.Data == "") {
                    this.webview.nativeWebView.parentElement.style.overflow = "hidden";
                }
                if (data.Path == "history.close" && data.Data == "") {
                    this.webview.url = "";
                    this.node.active = false;
                    AudioManager.Instance.playEffect(SoundEffect.BUTTON_CLICK);
                }
            }
        });

        let disableRecordWebView = () => {
            this.node.active = false;
        };
        window.addEventListener("offline", disableRecordWebView);
        window.addEventListener("error", disableRecordWebView);
    }

    public openUserRecord() {
        this.openWebview(`${PlayerInfo.getInstance().getAccountInfoUrl()}/daily?token=${Application.Instance.config.token}&lang=${I18n.Instance.currentLanguageForWebview}&volume=${AudioManager.Instance.effectVolume}&theme=gray`);
    }

    public openUserStatistics() {
        this.openWebview(`${PlayerInfo.getInstance().getAccountInfoUrl()}/daily-player?token=${Application.Instance.config.token}&lang=${I18n.Instance.currentLanguageForWebview}&volume=${AudioManager.Instance.effectVolume}&theme=gray`);
    }

    public openWebview(url: string) {
        this.node.active = true;
        this.webview.url = url;
    }
}