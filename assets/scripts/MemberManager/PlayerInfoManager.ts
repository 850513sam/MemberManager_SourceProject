import { _decorator, Component, Button, EditBox, Toggle, randomRangeInt } from 'cc';
import { Data, EPlayerType, PlayerInfo } from './Data';
import { PlayerListManager } from './PlayerListManager';
const { ccclass, property } = _decorator;

export class TmpPlayerSetting
{
    public name: string = "";
    public ability: number = 1;
    public isRegular: boolean = false;
    public isAttend: boolean = false;
    public isSpecial: boolean = false;
}

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
    @property(Toggle)
    private btnRegular: Toggle = null;
    @property(Toggle)
    private btnAttend: Toggle = null;
    @property(Toggle)
    private btnSpecial: Toggle = null;

    private tmpPlayerSetting: PlayerInfo = new PlayerInfo();
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
        this.btnRegular.node.on(Toggle.EventType.CLICK, this.onBtnRegular.bind(this));
        this.btnAttend.node.on(Toggle.EventType.CLICK, this.onBtnAttend.bind(this));
        this.btnSpecial.node.on(Toggle.EventType.CLICK, this.onBtnSpecial.bind(this));
    }

    private onBtnRegular()
    {
        this.tmpPlayerSetting.isRegular = !this.tmpPlayerSetting.isRegular;
    }
    
    private onBtnAttend()
    {
        this.tmpPlayerSetting.isAttend = !this.tmpPlayerSetting.isAttend;
    }
    
    private onBtnSpecial()
    {
        this.tmpPlayerSetting.type = EPlayerType.SPECIAL;
    }

    private onBtnAbility(ability: number)
    {
        this.tmpPlayerSetting.ability = ability;
    }

    private onBtnClose()
    {
        this.close();
    }

    private onBtnSave()
    {
        if (this.isAddPlayer)
        {
            const playerInfo: PlayerInfo = new PlayerInfo(Data.playerInfoList.length + 1);
            playerInfo.name = this.playerName.textLabel.string;
            playerInfo.ability = this.tmpPlayerSetting.ability;
            playerInfo.type = this.btnSpecial.isChecked ? EPlayerType.SPECIAL : EPlayerType.NORMAL;
            Data.playerInfoList.push(playerInfo);
            PlayerListManager.getInstance().addPlayerItem();
        }
        else
        {
            Data.playerInfoList[this.editIndex].name = this.playerName.textLabel.string;
            Data.playerInfoList[this.editIndex].ability = this.tmpPlayerSetting.ability;
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
        this.isAddPlayer = isAdd;
        this.btnDelete.node.active = !isAdd;
        if (!isAdd)
        {
            this.setUI(playerIndex);
        }
        else
        {
            this.initUI();
        }
    }

    private setUI(playerIndex: number)
    {
        this.editIndex = playerIndex;
        const playerInfo: PlayerInfo = Data.playerInfoList[playerIndex];
        this.playerName.string = playerInfo.name;
        this.playerAbility_1.isChecked = playerInfo.ability == 1;
        this.playerAbility_2.isChecked = playerInfo.ability == 2;
        this.playerAbility_3.isChecked = playerInfo.ability == 3;
        this.playerAbility_4.isChecked = playerInfo.ability == 4;
        this.playerAbility_5.isChecked = playerInfo.ability == 5;
        this.btnRegular.isChecked = playerInfo.isRegular;
        this.btnAttend.isChecked = playerInfo.isAttend;
        this.btnSpecial.isChecked = playerInfo.type == EPlayerType.SPECIAL;
        this.tmpPlayerSetting = playerInfo;
    }

    private initUI()
    {
        this.tmpPlayerSetting = new PlayerInfo();
        this.playerName.textLabel.string = "";
        this.playerAbility_1.isChecked = true;
        this.playerAbility_2.isChecked = false;
        this.playerAbility_3.isChecked = false;
        this.playerAbility_4.isChecked = false;
        this.playerAbility_5.isChecked = false;
        this.btnRegular.isChecked = false;
        this.btnAttend.isChecked = false;
        this.btnSpecial.isChecked = false;
    }

    public close()
    {
        this.node.active = false;
        this.playerName.string = "";
    }

    public generateTestData()
    {
        console.log("add test data !!!");
        for (let i = 0; i < 15; i++)
        {
            const playerInfo: PlayerInfo = new PlayerInfo(Data.playerInfoList.length + 1);
            playerInfo.name = `Player_${i.toString()}`;
            // playerInfo.ability = randomRangeInt(1, 6);
            playerInfo.ability = 1;
            playerInfo.type = EPlayerType.NORMAL;
            Data.playerInfoList.push(playerInfo);
            PlayerListManager.getInstance().addPlayerItem();
        }
    }
}
