import { _decorator, Component, Button, EditBox, Toggle } from 'cc';
import { Data, PlayerInfo } from './Data';
import { PlayerListManager } from './PlayerListManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerInfoManager')
export class PlayerInfoManager extends Component 
{
    @property(Button)
    private btnClose: Button = null;
    @property(Button)
    private btnSave: Button = null;
    @property(Button)
    private btnDelete: Button = null;
    @property(EditBox)
    private playerName: EditBox = null;
    @property(Toggle)
    private playerAbility_1: Toggle = null;
    @property(Toggle)
    private playerAbility_2: Toggle = null;
    @property(Toggle)
    private playerAbility_3: Toggle = null;
    @property(Toggle)
    private playerAbility_4: Toggle = null;
    @property(Toggle)
    private playerAbility_5: Toggle = null;

    private tmpPlayerAbility: number = 1;
    private isAddPlayer: boolean = true;
    private editIndex: number = -1;

    private static instance: PlayerInfoManager = null;
    public static getInstance(): PlayerInfoManager
    {
        return PlayerInfoManager.instance;
    }
    
    protected start() 
    {
        PlayerInfoManager.instance = this;
        this.close();
        this.addBtnEvent();
    }

    private addBtnEvent()
    {
        this.btnClose.node.on(Button.EventType.CLICK, this.onBtnClose.bind(this));
        this.btnSave.node.on(Button.EventType.CLICK, this.onBtnSave.bind(this));
        this.btnDelete.node.on(Button.EventType.CLICK, this.onBtnDelete.bind(this));
        this.playerAbility_1.node.on(Toggle.EventType.CLICK, () => { this.onBtnAbility(1); });
        this.playerAbility_2.node.on(Toggle.EventType.CLICK, () => { this.onBtnAbility(2); });
        this.playerAbility_3.node.on(Toggle.EventType.CLICK, () => { this.onBtnAbility(3); });
        this.playerAbility_4.node.on(Toggle.EventType.CLICK, () => { this.onBtnAbility(4); });
        this.playerAbility_5.node.on(Toggle.EventType.CLICK, () => { this.onBtnAbility(5); });
    }

    private onBtnAbility(ability: number)
    {
        this.tmpPlayerAbility = ability;
    }

    private onBtnClose()
    {
        this.close();
    }

    private onBtnSave()
    {
        if (this.isAddPlayer)
        {
            const playerInfo: PlayerInfo = new PlayerInfo();
            playerInfo.playerName = this.playerName.textLabel.string;
            playerInfo.playerAbility = this.tmpPlayerAbility;
            Data.playerInfoList.push(playerInfo);
            PlayerListManager.getInstance().addPlayerItem();
        }
        else
        {
            Data.playerInfoList[this.editIndex].playerName = this.playerName.textLabel.string;
            Data.playerInfoList[this.editIndex].playerAbility = this.tmpPlayerAbility;
        }
        this.close();
    }

    private onBtnDelete()
    {
        const playerInfoList: PlayerInfo[] = Data.playerInfoList;
        const deletePlayer: PlayerInfo = playerInfoList[this.editIndex];
        const deleteIndex: number = playerInfoList.indexOf(deletePlayer);
        playerInfoList.splice(deleteIndex, 1);
        PlayerListManager.getInstance().deletePlayer(this.editIndex);
        this.close();
    }

    public open(isAdd: boolean = true, playerIndex: number = 0)
    {
        this.node.active = true;
        this.isAddPlayer = true;
        this.btnDelete.node.active = !isAdd;
        if (!isAdd)
        {
            this.editIndex = playerIndex;
            const playerInfo: PlayerInfo = Data.playerInfoList[playerIndex];
            this.playerName.string = playerInfo.playerName;
            this.playerAbility_1.isChecked = playerInfo.playerAbility == 1;
            this.playerAbility_2.isChecked = playerInfo.playerAbility == 2;
            this.playerAbility_3.isChecked = playerInfo.playerAbility == 3;
            this.playerAbility_4.isChecked = playerInfo.playerAbility == 4;
            this.playerAbility_5.isChecked = playerInfo.playerAbility == 5;
        }
        else
        {
            this.playerAbility_1.isChecked = true;
            this.playerAbility_2.isChecked = false;
            this.playerAbility_3.isChecked = false;
            this.playerAbility_4.isChecked = false;
            this.playerAbility_5.isChecked = false;
        }
    }

    public close()
    {
        this.node.active = false;
        this.playerName.string = "";
    }

    public generateTestData()
    {
        for (let i = 0; i < 15; i++)
        {
            const playerInfo: PlayerInfo = new PlayerInfo();
            playerInfo.playerName = `Player_${i.toString()}`;
            playerInfo.playerAbility = 1;
            Data.playerInfoList.push(playerInfo);
            PlayerListManager.getInstance().addPlayerItem();
        }
    }
}
