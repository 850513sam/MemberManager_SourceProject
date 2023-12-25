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
        let nextPlayer: PlayerInfo = null;
        this.clearFakePlayer();
        this.updateRestingPlyers();
        this.updateNeedToPlayList();
        for (let i = 0; i < 4; i++)
        {
            nextPlayer = this.tryGetPlayer();
            if (i < 2)
            {
                teamA.push(nextPlayer);
            }
            else
            {
                teamB.push(nextPlayer);
            }
        }
        return nextMatchPlayers;
    }

    private tryGetPlayer(): PlayerInfo
    {
        let removeIndex: number = 0;
        let player: PlayerInfo = null;
        if (this.needToPlayList.length > 0)
        {
            player = this.needToPlayList[randomRangeInt(0, this.needToPlayList.length)];
        }
        if (!player)
        {
            player = this.restingPlayers[randomRangeInt(0, this.restingPlayers.length)];
            if (!player)
            {
                player = new PlayerInfo();
            }
            else
            {
                removeIndex = this.restingPlayers.indexOf(player);
                this.restingPlayers.splice(removeIndex, 1);
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
        const newRestingPlayer: PlayerInfo[] = [];
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        this.restingPlayers = [];
        playerInfoList.forEach((playerInfo: PlayerInfo) => 
        {
            if (!playerInfo.isPlaying)
            {
                newRestingPlayer.push(playerInfo);
            }
        });
        this.restingPlayers = newRestingPlayer;
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
