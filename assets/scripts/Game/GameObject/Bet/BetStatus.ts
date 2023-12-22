
import { NodePool } from 'cc';
import { instantiate } from 'cc';
import { _decorator, Component, Node, Prefab } from 'cc';
import { EventResponseData } from '../../../Data/DTO/Event.dto';
import { StartUp, GameEventType } from '../../StartUp';
import DenomConverter from '../../Helper/DenomConverter';
import { PlayerBetInfo } from './PlayerBetInfo';
import { TableState } from '../../../Data/DTO/Table.dto';
import { PlayerInfo } from '../../PlayerInfo';
const { ccclass, property } = _decorator;

@ccclass('BetStatus')
export class BetStatus extends Component {
    @property(Prefab)
    private playerBetInfoPrefab: Prefab = null;
    @property(Node)
    private localPlayerContent: Node = null;
    @property(Node)
    private otherPlayerContent: Node = null;
    @property(Node)
    private seperator: Node = null;
    @property(Node)
    private poolNode: Node = null;

    private pool: NodePool = new NodePool();

    private enterTableInit: boolean = false;

    protected onLoad() 
    {
        // StartUp.getInstance().node.on(GameEventType.ON_ENTER_TABLE, this.onEnterTable.bind(this));
        // StartUp.getInstance().node.on(GameEventType.NEW_EVENT_RECEIVED, (event) => this.onNewEventReceived(event), this);
        // StartUp.getInstance().node.on(GameEventType.TABLE_STATE_CHANGED, (state) => this.onTableStateChanged(state), this);
    }

    protected start() {
        // this.localPlayerContent.removeAllChildren();
        // this.otherPlayerContent.removeAllChildren();
        // this.seperator.active = false;
        // if (!this.enterTableInit && PlayerInfo.getInstance().getEntryEvent()) {
        //     this.onEnterTable();
        // }
    }

    private onEnterTable() {
        this.onNewEventReceived(PlayerInfo.getInstance().getEntryEvent().Event);
        this.enterTableInit = true;
    }

    private onTableStateChanged(state: TableState) {
        if (state === TableState.Waiting) {
            this.recycleAll();
        }
    }

    private onNewEventReceived(event: EventResponseData) {
        if (!event)
        {
            return;
        }

        if (event.Bets) {
            const bets = Object.values(event.Bets);
            if (this.allNodes.length < bets.length) {
                const countDifference = Math.abs(this.allNodes.length - bets.length);
                for (let i = 0; i < countDifference; i++) {
                    this.get();
                }
            }
            else if (this.allNodes.length > bets.length) {
                const countDifference = Math.abs(this.allNodes.length - bets.length);
                for (let i = 0; i < countDifference; i++) {
                    this.allNodes.slice(0, countDifference).forEach(node => this.put(node));
                }
            }
            const nodes = [...this.allNodes];
            bets.forEach((bet, index) => {
                const playerBetInfo = nodes[index].getComponent(PlayerBetInfo);
                const player = PlayerInfo.getInstance().getPlayers().find(p => p.ID === bet.PlayerID);
                playerBetInfo.setInfo(player.Nickname, DenomConverter.valueToDollar(bet.Bet), bet.Multiplier ?? 0, bet.Wager, bet.PlayerID);
                const parentNode = player.ID === PlayerInfo.getInstance().getPlayerID() ? this.localPlayerContent : this.otherPlayerContent;
                playerBetInfo.node.parent = null;
                parentNode.addChild(playerBetInfo.node);
            });
            this.seperator.active = this.localPlayerContent.children.length > 0;
        }
        else {
            this.seperator.active = false;
            this.recycleAll();
        }
    }

    private get allNodes(): Node[] {
        return [...this.localPlayerContent.children, ...this.otherPlayerContent.children, ...this.poolNode.children];
    }

    private get(): PlayerBetInfo {
        const info = (this.pool.get() ?? instantiate(this.playerBetInfoPrefab));
        this.poolNode.addChild(info);
        info.active = true;
        return info.getComponent(PlayerBetInfo);
    }

    private put(node: Node) {
        node.active = false;
        this.pool.put(node);
    }

    private recycleAll() {
        [...this.localPlayerContent.children].forEach((node) => this.put(node));
        [...this.otherPlayerContent.children].forEach((node) => this.put(node));
    }
}