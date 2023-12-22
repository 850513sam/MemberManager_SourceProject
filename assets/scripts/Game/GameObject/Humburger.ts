import { Button, Component, Node, _decorator } from 'cc';
import { PlayerInfo } from '../PlayerInfo';

const { ccclass, property } = _decorator;

@ccclass('HamburgerView')
export default class HamburgerView extends Component {
    @property(Node)
    public readonly historys : Node[] = [];

    protected onEnable(): void {
        // check if game acount url is empty, will hide history button
        if (PlayerInfo.getInstance().getAccountInfoUrl() == null) {
            this.historys.forEach((history) => {
                history.active = false;
            });
        }
    }
};

