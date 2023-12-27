import { _decorator, Component, randomRangeInt } from 'cc';
import { Data, PlayerInfo } from './Data';
const { ccclass, property } = _decorator;

@ccclass('MatchManager')
export class MatchManager extends Component 
{
    private restingPlayers: PlayerInfo[] = [];
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
        this.clearFakePlayer();
        this.updateRestingPlyers();
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
        let weakestPlayer: PlayerInfo = players[0];
        for (let i = 1; i < players.length; i++)
        {
            if (players[i].playerAbility >= strongestPlayer.playerAbility)
            {
                strongestPlayer = players[i];
            }

            if (players[i].playerAbility <= weakestPlayer.playerAbility)
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
        if (!player)
        {
            player = this.restingPlayers[randomRangeInt(0, this.restingPlayers.length)];
            if (player)
            {
                removeIndex = this.restingPlayers.indexOf(player);
                this.restingPlayers.splice(removeIndex, 1);
            }
            else
            {
                //return fake player
                player = new PlayerInfo(-1, true);
                player.playerName = "";
            }
        }
        else
        {
            removeIndex = this.needToPlayList.indexOf(player);
            this.needToPlayList.splice(removeIndex, 1);
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

    private updateRestingPlyers()
    {
        const restingPlayers: PlayerInfo[] = [];
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        this.restingPlayers = [];
        playerInfoList.forEach((playerInfo: PlayerInfo) => 
        {
            if (!playerInfo.isPlaying && !playerInfo.isDefaultPlayer)
            {
                restingPlayers.push(playerInfo);
            }
        });
        this.restingPlayers = restingPlayers;
    }

    private clearFakePlayer()
    {
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        let player: PlayerInfo = null;
        for (let i = 0; i < playerInfoList.length; i++)
        {
            player = playerInfoList[i];
            if (player.playerName == "")
            {
                const removeIndex: number = playerInfoList.indexOf(player);
                playerInfoList.splice(removeIndex, 1);
            }
        }
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
        return averageMatchCount > this.restingPlayers[playerIndex].completeMatchCount;
    }
}
