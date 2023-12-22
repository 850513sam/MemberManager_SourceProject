import Connection from './Network/Connection';
import Cryptor from './Network/Cryptor';
import EnhancedWebSocket from './Network/EnhancedWebSocket';
import { AppConfigData, AppConfigLoader } from './AppConfigLoader';
import { joinURL } from '../Toolkit/Utils/Utility';

export default class Application {
    private static instance: Application = null;
    private _config: AppConfigData = null;
    private _connection: Connection = null;
    private _i18n: any = null;

    private constructor() {}

    public static get Instance() {
        if (!this.instance) {
            this.instance = new Application();
        }
        return this.instance;
    }

    public get config() {
        if (!this._config) {
            this._config = AppConfigLoader.load();
        }
        return { ...this._config };
    }

    public get connection() {
        if (!this._connection) {
            this.initNetworkModule();
        }
        return this._connection;
    }

    public get i18n() {
        if (!this._i18n) {
            this.initI18nModule();
        }
        return this._i18n;
    }

    private async initI18nModule() {
        // TODO i18n module
        this._i18n = {};
    }

    private initNetworkModule() {
        const cryptor = new Cryptor(this.config.gameName, 16);
        const webSocket = new EnhancedWebSocket(joinURL(this.config.gameDomain, this.config.gameName), this.config.needEncrypt ? cryptor : null);
        this._connection = new Connection(webSocket);
    }
}
