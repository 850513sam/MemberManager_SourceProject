import { _decorator, Component, Label, Button } from 'cc';
import { CourtInfoManager } from './CourtInfoManager';
import { Data, PlayerInfo } from './Data';
import { PlayerInfoManager } from './PlayerInfoManager';
import { PlayerListManager } from './PlayerListManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerItem')
export class PlayerItem extends Component 
{
    @property(Label)
    private playerName: Label = null;
    @property(Button)
    private btnPlayer: Button = null;
    @property(Label)
    private completeMatchCount: Label = null;

    private playerIndex: number = -1;

    protected start() 
    {
        this.btnPlayer.node.on(Button.EventType.CLICK, this.onBtnPlayer.bind(this));
    }

    private onBtnPlayer()
    {
        if (PlayerListManager.getInstance().isEditCourtMode)
        {
            const playerInfo: PlayerInfo = Data.playerInfoList[this.playerIndex];
            CourtInfoManager.getInstance().setNewPlayer(playerInfo);
            playerInfo.isChoose = true;
        }
        else
        {
            PlayerInfoManager.getInstance().open(false, this.playerIndex);
        }
        PlayerListManager.getInstance().close();
    }

    public setPlayerInfo(playerName: string, playerIndex: number)
    {
        this.playerName.string = playerName;
        this.playerIndex = playerIndex;
    }

    public updatePlayerInfo(playerInfo: PlayerInfo)
    {
        this.playerName.string = playerInfo.name;
        this.completeMatchCount.string = playerInfo.completeMatchCount.toString();
    }
}
