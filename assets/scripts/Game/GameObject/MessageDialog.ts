import { _decorator } from 'cc';
import LocalizedLabel from '../../I18n/LocalizedComponent/LocalizedLabel';
import { Button } from 'cc';
import { PlayerInfo } from '../PlayerInfo';
import { GameState, HiloGameLogic } from '../Hilo/HiloGameLogic';
import AnimatedPage from '../../Toolkit/Components/Page/AnimatedPage';

const { ccclass, property } = _decorator;

@ccclass('MessageDialog')
export default class MessageDialog extends AnimatedPage {
    @property(LocalizedLabel)
    private readonly content: LocalizedLabel = null;

    protected async onLoad() {
        super.onLoad();
        this.closeButton.node.on(Button.EventType.CLICK, () => 
        {
            PlayerInfo.getInstance().isNotEnoughMsgExist = false;
        });
    }

    public display(message: string) 
    {
        if (message == "insufficient balance" || message == "3001")
        {
            PlayerInfo.getInstance().isNotEnoughMsgExist = true;
            if (HiloGameLogic.getInstance().getGameState() == GameState.GAME_STATE_BET)
            {
                HiloGameLogic.getInstance().setGameState(GameState.GAME_STATE_START);
            }
        }
        this.content.key = message;
        this.open();
    }

    protected async playOpenAnimation(): Promise<void> {
        await super.playOpenAnimation();
    }

    protected async playCloseAnimation(): Promise<void> {
        await super.playCloseAnimation();
    }
}
