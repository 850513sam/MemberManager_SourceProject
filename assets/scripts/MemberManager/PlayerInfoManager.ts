import { _decorator, Component, Button, EditBox, Toggle, randomRangeInt } from 'cc';
import { Data, EPlayerType, PlayerInfo } from './Data';
import { PlayerListManager } from './PlayerListManager';
import { tween } from 'cc';
import { EMsgCode, TipsManager } from './TipsManager';
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
    private btnSpecial: Toggle = null;
    @property(Toggle)
    private btnAbsent: Toggle = null;

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
        this.btnSpecial.node.on(Toggle.EventType.CLICK, this.onBtnSpecial.bind(this));
        this.btnAbsent.node.on(Toggle.EventType.CLICK, this.onBtnAbsent.bind(this));
    }

    private onBtnAbsent()
    {
        if (this.isAddPlayer)
        {
            //wait toggle event finish
            tween(this).delay(0.05).call(() => 
            {
                this.tmpPlayerSetting.isAbsent = this.btnAbsent.isChecked;
            }).start();
            return;
        }
        this.tmpPlayerSetting.isAbsent = !Data.playerInfoList[this.editIndex].isAbsent;
    }
    
    private onBtnSpecial()
    {
        if (this.isAddPlayer)
        {
            //wait toggle event finish
            tween(this).delay(0.05).call(() => 
            {
                this.tmpPlayerSetting.type = this.btnSpecial.isChecked ? EPlayerType.SPECIAL : EPlayerType.NORMAL;
            }).start();
            return;
        }
        const isSpecial: boolean = Data.playerInfoList[this.editIndex].type == EPlayerType.SPECIAL;
        this.tmpPlayerSetting.type = isSpecial ? EPlayerType.NORMAL : EPlayerType.SPECIAL;
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
        if (this.playerName.textLabel.string == "")
        {
            TipsManager.getInstance().open(EMsgCode.NAME_EMPTY);
            return;
        }
        if (this.isAddPlayer)
        {
            const playerInfo: PlayerInfo = new PlayerInfo(Data.playerInfoList.length + 1);
            playerInfo.name = this.playerName.textLabel.string;
            playerInfo.ability = this.tmpPlayerSetting.ability;
            playerInfo.type = this.btnSpecial.isChecked ? EPlayerType.SPECIAL : EPlayerType.NORMAL;
            playerInfo.isAbsent = this.tmpPlayerSetting.isAbsent;
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
            this.editIndex = -1;
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
        this.btnSpecial.isChecked = playerInfo.type == EPlayerType.SPECIAL;
        this.btnAbsent.isChecked = playerInfo.isAbsent;
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
        this.btnSpecial.isChecked = false;
        this.btnAbsent.isChecked = false;
    }

    public close()
    {
        this.node.active = false;
        this.playerName.string = "";
    }

    public generateTestData(count: number = 0)
    {
        if (count == 0)
        {
            return;
        }
        console.log("add test data !!!");
        for (let i = 0; i < count; i++)
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
