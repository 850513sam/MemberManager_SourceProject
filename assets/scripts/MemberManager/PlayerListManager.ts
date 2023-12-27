import { _decorator, Component, Node, Prefab, Button, UITransform, instantiate, ScrollView } from 'cc';
import { Data, PlayerInfo } from './Data';
import { PlayerInfoManager } from './PlayerInfoManager';
import { PlayerItem } from './PlayerItem';
const { ccclass, property } = _decorator;

@ccclass('PlayerListManager')
export class PlayerListManager extends Component 
{
    @property(Prefab)
    private playerItem: Prefab = null;
    @property(UITransform)
    private playerItemRoot: UITransform = null;
    @property(Button)
    private btnClose: Button = null;
    @property(ScrollView)
    private scroll: ScrollView = null;

    private playerItemList: Node[] = [];
    public isEditCourtMode: boolean = false;

    private static instance: PlayerListManager = null;
    public static getInstance(): PlayerListManager
    {
        return PlayerListManager.instance;
    }
    
    protected start() 
    {
        PlayerListManager.instance = this;
        this.close();
        this.btnClose.node.on(Button.EventType.CLICK, this.onBtnClose.bind(this));
        // PlayerInfoManager.getInstance().generateTestData();
    }

    private onBtnClose()
    {
        this.close();
    }

    public open(isHidePlayerMember: boolean)
    {
        this.node.active = true;
        this.updatePlayerStatus(isHidePlayerMember);
        this.scroll.scrollToTop();
        this.playerItemList.forEach((playerItem: Node, i) => 
        {
            const completeMatchCount: number = Data.playerInfoList[i].completeMatchCount;
            playerItem.getComponent(PlayerItem).updateMatchCompleteCount(completeMatchCount);
        });
    }

    public close()
    {
        this.node.active = false;
    }

    private updatePlayerStatus(isHidePlayerMember: boolean)
    {
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        let isShow: boolean = false;
        for (let i = 0; i < playerInfoList.length; i++)
        {
            if (playerInfoList[i].isDefaultPlayer)
            {
                continue;
            }
            isShow = !isHidePlayerMember ? true : !playerInfoList[i].isChoose;
            this.playerItemList[i].active = isShow;
        }
    }

    public addPlayerItem()
    {
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        const playerCount: number = playerInfoList.length;
        const playerName: string = playerInfoList[playerCount - 1].playerName;
        const playerItem: Node = instantiate(this.playerItem);
        playerItem.setParent(this.playerItemRoot.node);
        playerItem.getComponent(PlayerItem).setPlayerInfo(playerName, playerInfoList.length - 1);
        this.playerItemList.push(playerItem);
    }

    public deletePlayer(playerIndex: number)
    {
        const deletePlayer: Node = this.playerItemList[playerIndex];
        this.playerItemList.splice(playerIndex, 1);
        this.playerItemRoot.node.removeChild(deletePlayer);
    }
}
