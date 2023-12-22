import { defaultAppConfig } from '../Data/Config/app.config';
import Parameter from '../Toolkit/Utils/Parameter';

export type AppConfigData = {
    gameName: string;
    gameVersion: string;
    gameDomain: string;
    token: string;
    platformID: number;
    walletTypeID: number;
    needEncrypt: boolean;
    language: string;
    homeURL: string;
    useIFrame: string;
    hideExit: boolean; // 隱藏離開按鈕
    debug: boolean;
};

export namespace AppConfigLoader {
    export function load(): AppConfigData {
        return {
            gameName: Parameter.get('gameID', defaultAppConfig.GameName),
            gameVersion: defaultAppConfig.GameVersion,
            gameDomain: Parameter.get('gameDomain', defaultAppConfig.GameDomain),
            token: Parameter.get('token') ?? generateDummyUserToken(36),
            platformID: +(Parameter.get('platform') ?? defaultAppConfig.PlatformsID),
            walletTypeID: +(Parameter.get('wt') ?? defaultAppConfig.WalletTypesID),
            needEncrypt: defaultAppConfig.NeedEncrypt,
            language: Parameter.get('lang', defaultAppConfig.Lauguage),
            homeURL: Parameter.get('homeUrl'),
            useIFrame: Parameter.get('useIFrame'),
            hideExit: Parameter.get('hideExit') === 'true',
            debug: defaultAppConfig.Debug,
        };
    }
}

function generateDummyUserToken(length: number) {
    // generate random 36-digit string as dummy user token
    const characterSet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';
    for (let i = 0; i < length; i++) {
        result += characterSet.charAt(Math.trunc(Math.random() * characterSet.length));
    }
    return result;
}
