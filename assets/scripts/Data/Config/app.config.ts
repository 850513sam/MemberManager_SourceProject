import { settings } from "cc";
import { DEV } from "cc/env";

const appConfig = {
    GameName: 'hilo',
    GameVersion: 'v1.0.16',
    PlatformsID: 1,
    WalletTypesID: 1,
    Lauguage: 'en',
}

export const defaultAppConfig = DEV ? Object.assign(appConfig, {
    GameDomain: 'ws://192.168.127.152:9004/api/v1/games',
    NeedEncrypt: false,
    Debug: true,
}): Object.assign(appConfig, {
    GameDomain: settings.querySettings("settings", "ServerWebsocket"),
    NeedEncrypt: settings.querySettings("settings", "Encrypt"),
    Debug: settings.querySettings("settings", "Debug"),
});
