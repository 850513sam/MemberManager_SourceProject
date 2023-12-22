import { PathName, PublishDataType, RequestResponseDataType } from '../../Data/Config/path.config';
import EnhancedWebSocket from './EnhancedWebSocket';
import { CustomErrorName } from '../../ErrorHandler/Config/error.config';
import { DebugRequestData } from '../../Data/DTO/Debug.dto';
import { BetRequestData } from '../../Data/DTO/Bet.dto';
import { PlayerInfo } from '../../Game/PlayerInfo';

export default class Connection {
    private webSocket: EnhancedWebSocket = null;

    private onDisconnectCallbacks: Function[] = [];

    constructor(websocket: EnhancedWebSocket) {
        this.webSocket = websocket;
        this.webSocket.onDisconnected = () => {
            this.onDisconnectCallbacks.forEach((callback) => callback());
        };
        this.webSocket.setExceptedErrorMessages(PathName.Bet, [CustomErrorName.INSUFFICIENT_BALANCE]);
    }

    public listenForDisconnect(callback: () => void) {
        this.onDisconnectCallbacks.push(callback);
    }

    public send<T extends keyof RequestResponseDataType>
    (path: T, data: RequestResponseDataType[T][0], errorMsg: CustomErrorName[] = []): Promise<RequestResponseDataType[T][1]>
    {
        return this.webSocket.send(path, data, errorMsg);
    }

    public listenForPublishData<T extends keyof PublishDataType>(path: T, callback: (data: PublishDataType[T]) => void) 
    {
        this.webSocket.subscribe(path, callback);
    }

    public stoplisteningForPublishData<T extends keyof PublishDataType>(path: T, callback: (data: PublishDataType[T]) => void) {
        this.webSocket.unsubscribe(path, callback);
    }

    public listenForError<T extends keyof PublishDataType>(path: T, callback: (err: string) => boolean) {
        this.webSocket.subscribeError(path, callback);
    }

    public stoplisteningForError<T extends keyof PublishDataType>(path: T, callback: (err: string) => boolean) {
        this.webSocket.unsubscribeError(path, callback);
    }

    public blockDisconnectionMessage() {
        this.webSocket.blockDisconnectedMessage = true;
    }

    public startConnecting() {
        return this.webSocket.connect();
    }

    public async login(Token: string, PlatformsID: number, WalletTypesID: number, EntryTable: boolean) {
        const result = this.webSocket.send(PathName.Login, {
            Token,
            PlatformsID,
            WalletTypesID,
            EntryTable,
        });
        this.webSocket.cryptKey = Token;
        result.then(() => {
            this.webSocket.keepAlive();
        });
        return result;
    }

    public getTableStatus() {
        return this.webSocket.send(PathName.Refresh);
    }


    public onMoneyNotEnough()
    {
        if (!PlayerInfo.getInstance().isNotEnoughMsgExist)
        {
            this.webSocket.onMoneyNotEnough();
        }
    }
}
