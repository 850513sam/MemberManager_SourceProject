import { _decorator, Component, randomRangeInt } from 'cc';
import { Data, EPlayerType, PlayerInfo } from './Data';
const { ccclass, property } = _decorator;

@ccclass('MatchManager')
export class MatchManager extends Component 
{
    private restingPlayers: PlayerInfo[] = [];
    private playingPlayers: PlayerInfo[] = [];
    private needToPlayList: PlayerInfo[] = [];

    private static instance: MatchManager = null;
    public static getInstance(): MatchManager
    {
        return MatchManager.instance;
    }
    
    protected start() 
    {
        MatchManager.instance = this;
    }

    public getNextMatchPlayers(): PlayerInfo[][]
    {
        const teamA: PlayerInfo[] = [];
        const teamB: PlayerInfo[] = [];
        const nextMatchPlayers: PlayerInfo[][] = [teamA, teamB];
        let tmpNextMatchPlayers: PlayerInfo[] = [];
        let nextPlayer: PlayerInfo = null;
        this.updatePlayerStatus();
        this.updateNeedToPlayList();
        for (let i = 0; i < 4; i++)
        {
            nextPlayer = this.tryGetPlayer();
            tmpNextMatchPlayers.push(nextPlayer);
        }
        tmpNextMatchPlayers = this.resortPlayersByAbility(tmpNextMatchPlayers);
        teamA.push(tmpNextMatchPlayers[0]);
        teamA.push(tmpNextMatchPlayers[1]);
        teamB.push(tmpNextMatchPlayers[2]);
        teamB.push(tmpNextMatchPlayers[3]);
        return nextMatchPlayers;
    }

    private resortPlayersByAbility(players: PlayerInfo[]): PlayerInfo[]
    {
        let newTeam: PlayerInfo[] = [];
        let strongestPlayer: PlayerInfo = players[0];
        let weakestPlayer: PlayerInfo = players[1];
        for (let i = 0; i < players.length; i++)
        {
            if (players[i].ability > strongestPlayer.ability)
            {
                strongestPlayer = players[i];
            }
            if (players[i].ability < weakestPlayer.ability)
            {
                weakestPlayer = players[i];
            }
        }
        players.splice(players.indexOf(strongestPlayer), 1);
        players.splice(players.indexOf(weakestPlayer), 1);
        newTeam.push(strongestPlayer);
        newTeam.push(weakestPlayer);
        newTeam.push(players[0]);
        newTeam.push(players[1]);
        return newTeam;
    }

    private tryGetPlayer(): PlayerInfo
    {
        let removeIndex: number = 0;
        let player: PlayerInfo = null;
        //find less first
        if (this.needToPlayList.length > 0)
        {
            player = this.needToPlayList[randomRangeInt(0, this.needToPlayList.length)];
        }
        if (player)
        {
            removeIndex = this.needToPlayList.indexOf(player);
            this.needToPlayList.splice(removeIndex, 1);            
        }
        else
        {
            player = this.restingPlayers[randomRangeInt(0, this.restingPlayers.length)];
            if (player)
            {
                removeIndex = this.restingPlayers.indexOf(player);
                this.restingPlayers.splice(removeIndex, 1);
            }
            else
            {
                player = this.playingPlayers[randomRangeInt(0, this.playingPlayers.length)];
                removeIndex = this.playingPlayers.indexOf(player);
                this.playingPlayers.splice(removeIndex, 1);
            }
        }
        return player;
    }
    
    private updateNeedToPlayList()
    {
        this.needToPlayList = [];
        for (let i = 0; i < this.restingPlayers.length; i++)
        {
            if (this.getIsNeedToPlay(i))
            {
                this.needToPlayList.push(this.restingPlayers[i]);
            }
        }
    }

    private updatePlayerStatus()
    {
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        let playerList: PlayerInfo[] = [];
        this.restingPlayers = [];
        this.playingPlayers = [];
        playerInfoList.forEach((playerInfo: PlayerInfo) => 
        {
            if (playerInfo.type == EPlayerType.NORMAL)
            {
                playerList = playerInfo.isPlaying ? this.playingPlayers : this.restingPlayers;
                playerList.push(playerInfo);
            }
        });
    }

    private getIsNeedToPlay(playerIndex: number): boolean
    {
        let totalMatchCount: number = 0;
        let averageMatchCount: number = 0;
        for (let i = 0; i < this.restingPlayers.length; i++)
        {
            if (i != playerIndex)
            {
                totalMatchCount += this.restingPlayers[i].completeMatchCount;
            }
        }
        averageMatchCount = totalMatchCount / (this.restingPlayers.length - 1);
        return averageMatchCount + 1 > this.restingPlayers[playerIndex].completeMatchCount;
    }
}
