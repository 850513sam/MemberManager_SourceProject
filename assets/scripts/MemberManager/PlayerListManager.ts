import { _decorator, Component, Node, Prefab, Button, UITransform, instantiate, ScrollView } from 'cc';
import { Data, EPlayerType, PlayerInfo } from './Data';
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
        setTimeout(() => 
        {            
            // PlayerInfoManager.getInstance().generateTestData();
        }, 200);
    }

    private onBtnClose()
    {
        this.close();
    }

    public open(isHidePlayingMember: boolean)
    {
        this.node.active = true;
        this.scroll.scrollToTop();
        this.updatePlayerInfo(isHidePlayingMember);
    }

    private updatePlayerInfo(isHidePlayerMember: boolean)
    {
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        let isShow: boolean = false;
        for (let i = 0; i < playerInfoList.length; i++)
        {
            if (playerInfoList[i].type == EPlayerType.DEFAULT)
            {
                continue;
            }
            isShow = !isHidePlayerMember ? true : !playerInfoList[i].isChoose;
            this.playerItemList[i - 8].active = isShow;
            this.playerItemList[i - 8].getComponent(PlayerItem).updatePlayerInfo(playerInfoList[i]);
        }
    }

    public close()
    {
        this.node.active = false;
    }

    public addPlayerItem()
    {
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        const playerCount: number = playerInfoList.length;
        const playerName: string = playerInfoList[playerCount - 1].name;
        const playerItem: Node = instantiate(this.playerItem);
        playerItem.setParent(this.playerItemRoot.node);
        playerItem.getComponent(PlayerItem).setPlayerInfo(playerName, playerInfoList.length - 1);
        this.playerItemList.push(playerItem);
    }

    public deletePlayer(playerIndex: number)
    {
        const deletePlayer: Node = this.playerItemList[playerIndex - 8];
        this.playerItemList.splice(playerIndex, 1);
        this.playerItemRoot.node.removeChild(deletePlayer);
    }
}
