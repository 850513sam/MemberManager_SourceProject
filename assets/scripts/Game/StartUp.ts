import { game, Game as CCGame, Component } from 'cc';
import Application from '../Application/Application';
import MessageManager from './MessageManager';
import { _decorator } from 'cc';
import { EnterTableResponseData, TableState } from '../Data/DTO/Table.dto';
import AudioManager from './AudioManager';
import { SoundEffect } from './Config/audio.config';
import { defaultAppConfig } from '../Data/Config/app.config';
import { PathName } from '../Data/Config/path.config';
import { PlayerInfo } from './PlayerInfo';
import { HiloGameLogic } from './Hilo/HiloGameLogic';
import DenomConverter from './Helper/DenomConverter';
import { BalanceResponseData } from '../Data/DTO/Balance.dto';
import { LoginResponseData } from '../Data/DTO/Login.dto';
import { HiloGameConnection } from './Hilo/HiloGameConnection';

const { ccclass } = _decorator;

export enum GameEventType 
{
    TABLE_STATE_CHANGED = "TABLE_STATE_CHANGED",
    NEW_EVENT_RECEIVED = "NEW_EVENT_RECEIVED",
    ON_LOGIN = "ON_LOGIN",
    ON_ENTER_TABLE = "ON_ENTER_TABLE",
    NEXT_HASH = "NEXT_RESULT",
    RESULT = "RESULT",
}

@ccclass('StartUp')
export class StartUp extends Component {
    private messageManager: MessageManager = null;
    
    private _state: TableState = null;
    private gameIsHidden: boolean = false;
    
    private static instance: StartUp = null;
    public static getInstance(): StartUp 
    {
        if (!StartUp.instance)
        {
            StartUp.instance = new StartUp();
        }
        return StartUp.instance;
    }

    public get state() 
    {
        return this._state;
    }
    private set state(newState: TableState) 
    {
        if (newState === this._state) 
        {
            return;
        }
        this._state = newState;
        if (this._state === TableState.Receiving && !this.gameIsHidden) 
        {
            AudioManager.Instance.playEffect(SoundEffect.ROUND_START);
        }
        this.node.emit(GameEventType.TABLE_STATE_CHANGED, this.state);
    }

    public get message() 
    {
        return this.messageManager;
    }

    protected onLoad() 
    {
        StartUp.instance = this;
        game.addPersistRootNode(this.node);

        game.on(CCGame.EVENT_HIDE, () => 
        {
            this.gameIsHidden = true;
        });

        game.on(CCGame.EVENT_SHOW, () => 
        {
            this.gameIsHidden = false;
        });
    }

    protected start() 
    {
        this.addConnectEvent();
        console.log(defaultAppConfig.GameVersion);
    }

    private addConnectEvent()
    {
        Application.Instance.connection.listenForPublishData(PathName.Login, this.onLogin.bind(this));
        Application.Instance.connection.listenForPublishData(PathName.EnterTable, this.onEnterTable.bind(this));
        Application.Instance.connection.listenForPublishData(PathName.Balance, this.updateBalance.bind(this));
    }

    private onLogin(event: LoginResponseData) 
    {
        PlayerInfo.getInstance().setnickName(event.Nickname);
        PlayerInfo.getInstance().setDenom(event.Denom);
        PlayerInfo.getInstance().setAccountInfoUrl(event.AccountInfoURL);
        PlayerInfo.getInstance().setPlayerMoney(event.Balance);
        this.node.emit(GameEventType.ON_LOGIN);
    }

    private onEnterTable(event: EnterTableResponseData)
    {
        this.node.emit(GameEventType.ON_ENTER_TABLE);
        PlayerInfo.getInstance().setTableState(event.State);
        PlayerInfo.getInstance().setEntryEvent(event);
        PlayerInfo.getInstance().setPlayerID(event.PlayerID);
        HiloGameConnection.getInstance().init();
        HiloGameLogic.getInstance().init(event);
        if (!event.Event) 
        {
            return;
        }
        if (event.Event.Players)
        {
            PlayerInfo.getInstance().setPlayers(Object.values(event.Event.Players));
        }
    }

    private updateBalance(event: BalanceResponseData) 
    {
        PlayerInfo.getInstance().setPlayerMoney(event.Balance);
    }
    
    public attachMessageManager(messageManager: MessageManager) 
    {
        this.messageManager = messageManager;
    }

    public closeGame()
    {
        if (Application.Instance.config.useIFrame) {
            window.parent.postMessage({ event: 'close' }, '*');
        } 
        else if (Application.Instance.config.homeURL) 
        {
            document.location.href = Application.Instance.config.homeURL;
        } 
        else 
        {
            window.close();
            window.history.back();
        }
    }
}
