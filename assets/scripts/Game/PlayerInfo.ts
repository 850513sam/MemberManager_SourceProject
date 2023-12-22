import { _decorator } from "cc";
import { EnterTableResponseData, TableState } from "../Data/DTO/Table.dto";
import { PlayerResponseData } from "../Data/DTO/Player.dto";
import DenomConverter from "./Helper/DenomConverter";
import { HiloGameView } from "./Hilo/HiloGameView";
import { GameState, HiloGameLogic } from "./Hilo/HiloGameLogic";
import { HiloGameData } from "./Hilo/HiloGameData";
import Application from "../Application/Application";

const { ccclass } = _decorator;
@ccclass('PlayerInfo')
export class PlayerInfo 
{
    private static instance: PlayerInfo = null;
    public static getInstance(): PlayerInfo 
    {
        if (!PlayerInfo.instance)
        {
            PlayerInfo.instance = new PlayerInfo();
        }
        return PlayerInfo.instance;
    }

    private playerMoney: number = 0;
    public isNotEnoughMsgExist = false;
    public getPlayerMoney(): number
    {
        return this.playerMoney;
    }

    public setPlayerMoney(playerMoney: number)
    {
        let gameView: HiloGameView = HiloGameView.getInstance();
        let gameLogic: HiloGameLogic = HiloGameLogic.getInstance();
        let gameData: HiloGameData = HiloGameData.getInstance();
        let isBetState: boolean = gameLogic.getGameState() == GameState.GAME_STATE_BET;
        let isNewRound: boolean = gameData.getIsNewRound();
        if (gameLogic)
        {
            if (isBetState && isNewRound)
            {
                let currentBetvalue: number = gameData.getCurrentBetValue();
                let denom: number = this.getDenom();
                if (playerMoney -  currentBetvalue * denom < 0)
                {
                    Application.Instance.connection.onMoneyNotEnough();
                    this.isNotEnoughMsgExist = true;
                }
                else
                {
                    playerMoney -= currentBetvalue * denom;
                }
            }
        }
        this.playerMoney = DenomConverter.valueToDollar(playerMoney);
        if (gameView)
        {
            gameView.updatePlayerMoney();
        }
    }

    private denom: number = 0;
    public getDenom(): number
    {
        return this.denom;
    }

    public setDenom(denom: number)
    {
        this.denom = denom;
    }

    private entryEvent: EnterTableResponseData = null;
    public getEntryEvent(): EnterTableResponseData
    {
        return this.entryEvent;
    }

    public setEntryEvent(entryEvent: EnterTableResponseData)
    {
        this.entryEvent = entryEvent;
    }

    private nickName: string = null;
    public getnickName(): string
    {
        return this.nickName;
    }

    public setnickName(nickName: string)
    {
        this.nickName = nickName;
    }

    private playerID: number = -1;
    public getPlayerID(): number
    {
        return this.playerID;
    }

    public setPlayerID(playerID: number)
    {
        this.playerID = playerID;
    }

    private accountInfoUrl: string = "";
    public getAccountInfoUrl(): string
    {
        return this.accountInfoUrl;
    }

    public setAccountInfoUrl(accountInfoUrl: string)
    {
        this.accountInfoUrl = accountInfoUrl;
    }

    private tableState: TableState = null;
    public getTableState(): TableState
    {
        return this.tableState;
    }

    public setTableState(tableState: TableState)
    {
        this.tableState = tableState;
    }

    private players: PlayerResponseData[] = [];
    public getPlayers(): PlayerResponseData[]
    {
        return this.players;
    }

    public setPlayers(players: PlayerResponseData[])
    {
        this.players = players;
    }
}