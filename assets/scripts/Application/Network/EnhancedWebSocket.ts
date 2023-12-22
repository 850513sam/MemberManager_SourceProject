import { error, log, sys } from 'cc';
import Cryptor from './Cryptor';
import ErrorHandler from '../../ErrorHandler/ErrorHandler';
import { PathName, PublishDataType, RequestResponseDataType } from '../../Data/Config/path.config';
import { CustomErrorName } from '../../ErrorHandler/Config/error.config';
import Delay from '../../Toolkit/Utils/Delay';

/** Native websocket with additional functionalities
 * 1. request/response simulation (with type)
 * 2. subscribe/unsubscribe to specific path
 * 3. auto reconnection
 * 4. timeout tracking
 * */
export default class EnhancedWebSocket {
    public static readonly DEFAULT_TIMEOUT = 10000;
    public static readonly DEFAULT_DELAY = 500;
    private static readonly KEEP_ALIVE_INTERVAL = 1000;

    private websocket: WebSocket = null;
    private messageDispatcher: {
        [path in keyof RequestResponseDataType]?: [(message: RequestResponseDataType[path][1]) => void, (reason?: any) => void][];
    } = {};
    private messageBroadcaster: {
        [path in keyof PublishDataType]?: ((message: PublishDataType[path]) => void)[];
    } = {};
    private errorBoardcaster: {
        [path in keyof PublishDataType]?: ((error: string) => boolean)[];
    } = {};
    private readonly needEncrypt: boolean = false;
    private expectedErrorMessages: {
        [path in keyof PublishDataType]?: string[];
    } = {};

    // callback
    public onDisconnected: () => void = null;

    private previousDelays: number[] = [];

    public blockDisconnectedMessage: boolean = false;

    public set cryptKey(key: string) {
        if (!this.cryptor) {
            return;
        }
        this.cryptor.key = key;
    }

    public get averageDelay() {
        if (!this.previousDelays.length) {
            return EnhancedWebSocket.DEFAULT_DELAY;
        }
        return this.previousDelays.reduce((pre, cur) => pre + cur, 0) / this.previousDelays.length;
    }

    constructor(private readonly url: string | URL, private readonly cryptor: Cryptor) {
        this.needEncrypt = !!cryptor;
    }

    public setExceptedErrorMessages<T extends keyof PublishDataType>(path: T, errorMessages: string[]) {
        this.expectedErrorMessages[path] = errorMessages;
    }

    public connect() {
        let connectSuccessfully = false;
        this.websocket = new WebSocket(this.url);
        const connectionPromise = new Promise<void>((resolve) => {
            this.websocket.onopen = () => {
                connectSuccessfully = true;
                log('Connection start successfully');
                resolve();
            };
        });
        this.websocket.onmessage = (event: MessageEvent) => {
            const receiveData = JSON.parse(event.data);
            const decryptData: {
                Path: PathName;
                Data: any;
                Err: string;
            } = receiveData instanceof Object ? receiveData : JSON.parse(this.cryptor.decrypt(receiveData));
            const { Path, Data, Err } = decryptData;

            if (Err) {
                const reject: (reason?: any) => void = this.messageDispatcher[Path]?.shift()?.[1];
                if (reject) {
                    reject(Err);
                } else if (this.expectedErrorMessages[Path]?.includes(Err)) {
                    if (this.errorBoardcaster[Path]?.every((notify: (error: string) => boolean) => !notify(Err))) {
                        this.handleCustomError(new Error(Err));
                    }
                } else {
                    this.handleCustomError(new Error(Err));
                }
                return;
            }
            // response
            this.messageDispatcher[Path]?.shift()?.[0](Data);
            // boardcast
            this.messageBroadcaster[Path]?.forEach((notify) => notify(Data));
        };
        this.websocket.onerror = error;
        this.websocket.onclose = async () => {
            if (!connectSuccessfully)
            {
                this.showDisconnectMsg();
            }
            this.informNetworkDisconnecting();
            log('Connection closed');
        };
        return connectionPromise;
    }

    /**
     * 發送請求並等待回傳資料
     * @param path 路徑
     * @param postData 指定路徑的附帶資訊
     * @param expectedErrorMessages 預期會有的錯誤訊息
     * @param timeout 等待server回應最大容忍時間, -1 表示不使用timeout機制
     * @returns 指定路徑的回傳資料
     */
    public async send<T extends keyof RequestResponseDataType>(
        path: T,
        postData?: RequestResponseDataType[T][0],
        expectedErrorMessages: CustomErrorName[] = [],
        timeout = EnhancedWebSocket.DEFAULT_TIMEOUT
    ): Promise<RequestResponseDataType[T][1]> {
        if (timeout < 0 && timeout !== -1) {
            throw new Error('Invalid timeout');
        }
        // 連線狀態為開啟才能傳送訊息
        if (this.websocket.readyState !== WebSocket.OPEN) {
            if (!this.blockDisconnectedMessage) 
            {
                this.showDisconnectMsg();
            }
            return Delay.forever();
        }
        const result = Object.assign({ Path: path }, postData ? { Data: postData } : {});
        const encryptResult = this.needEncrypt ? this.cryptor.encrypt(JSON.stringify(result)) : result;
        this.websocket.send(JSON.stringify(encryptResult));

        return Promise.race([
            new Promise<RequestResponseDataType[T][1]>((resolve, reject) => {
                const dispatcher = this.messageDispatcher[path] || (this.messageDispatcher[path] = []);
                dispatcher.push([resolve, reject]);
            }),
            timeout === -1 ? Delay.forever() : Delay.reject<RequestResponseDataType[T][1]>(timeout, CustomErrorName.TIMEOUT),
        ]).catch((reason) => {
            if (expectedErrorMessages.includes(reason)) {
                throw reason;
            }
            if (reason === CustomErrorName.TIMEOUT) {
                error(`timeout at path ${path}`);
                if (!this.blockDisconnectedMessage) 
                {
                    this.showDisconnectMsg();
                }
            } else {
                this.handleCustomError(reason);
            }
            return Delay.forever();
        });
    }

    private showDisconnectMsg()
    {
        const isIos: boolean = sys.os == sys.OS.IOS;
        const errorMsg: string = isIos ? CustomErrorName.OPERATE_TIMEOUT : CustomErrorName.CONNECTION_FAILED;
        this.handleCustomError(errorMsg);
    }

    public onMoneyNotEnough()
    {
        this.handleCustomError("insufficient balance");
    }

    /**
     * 訂閱特定路徑的資料
     * @param path 路徑
     * @param notify 通知資料送達用的 callback
     */
    public subscribe<T extends keyof PublishDataType>(path: T, notify: (data: PublishDataType[T]) => void) {
        let subscriberQueue = this.messageBroadcaster[path];
        if (!subscriberQueue) {
            subscriberQueue = [];
            this.messageBroadcaster[path] = subscriberQueue;
        }
        subscriberQueue.push(notify);
    }

    /**
     * 取消訂閱特定路徑的資料
     * @param path 路徑
     * @param notify 通知資料送達用的 callback
     */
    public unsubscribe<T extends keyof PublishDataType>(path: T, notify: (data: PublishDataType[T]) => void) {
        let subscriberQueue = this.messageBroadcaster[path];
        if (!subscriberQueue) {
            subscriberQueue = [];
            this.messageBroadcaster[path] = subscriberQueue;
        }
        const handlerIndex = subscriberQueue.findIndex((subscriber) => subscriber === notify);
        if (handlerIndex !== -1) {
            subscriberQueue.splice(handlerIndex, 1);
        }
    }

    /**
     * 訂閱特定路徑的資料
     * @param path 路徑
     * @param notify 通知資料送達用的 callback
     */
    public subscribeError<T extends keyof PublishDataType>(path: T, notify: (errorMessage: string) => boolean) {
        let subscriberQueue = this.errorBoardcaster[path];
        if (!subscriberQueue) {
            subscriberQueue = [];
            this.errorBoardcaster[path] = subscriberQueue;
        }
        subscriberQueue.push(notify);
    }

    /**
     * 取消訂閱特定路徑的資料
     * @param path 路徑
     * @param notify 通知資料送達用的 callback
     */
    public unsubscribeError<T extends keyof PublishDataType>(path: T, notify: (errorMessage: string) => boolean) {
        let subscriberQueue = this.errorBoardcaster[path];
        if (!subscriberQueue) {
            subscriberQueue = [];
            this.errorBoardcaster[path] = subscriberQueue;
        }
        const handlerIndex = subscriberQueue.findIndex((subscriber) => subscriber === notify);
        if (handlerIndex !== -1) {
            subscriberQueue.splice(handlerIndex, 1);
        }
    }

    public async keepAlive() {
        const requestTime = Date.now();
        await this.send(PathName.Ack, undefined, [], EnhancedWebSocket.DEFAULT_TIMEOUT + this.averageDelay);
        this.previousDelays.push(Date.now() - requestTime);
        if (this.previousDelays.length > 5) {
            this.previousDelays.shift();
        }
        await Delay.resolve(EnhancedWebSocket.KEEP_ALIVE_INTERVAL);
        this.keepAlive();
    }

    private informNetworkDisconnecting() {
        this.onDisconnected?.();
        this.onDisconnected = null;
    }

    /**
     * try to handle error, if error is fatal then close the connection
     * @param err error object
     */
    private handleCustomError(err: Error): void;
    /**
     * try to handle error, if error is fatal then close the connection
     * @param message  error message
     */
    private handleCustomError(message: string): void;
    private handleCustomError(arg: Error | string) {
        if (arg instanceof Error && ErrorHandler.Instance.handle(arg)) {
            return;
        }
        if (typeof arg === 'string' && ErrorHandler.Instance.handle(arg)) {
            return;
        }
        if (this.websocket.readyState === WebSocket.CLOSED || this.websocket.readyState === WebSocket.CLOSING) {
            return;
        }
        this.websocket.close();
        // onclose event will not be triggered immediately so here informNetworkDisconnecting is invoked manually
        this.informNetworkDisconnecting();
    }
}
