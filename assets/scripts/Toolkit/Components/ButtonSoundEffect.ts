import { Button, Component, Node, _decorator } from 'cc';
import AudioManager from '../../Game/AudioManager';
import { SoundEffect } from '../../Game/Config/audio.config';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('ButtonSoundEffect')
@requireComponent(Button)
export default class ButtonSoundEffect extends Component {
    @property
    private audioClipKey = '';

    @property
    private playOnTouchEnd = true;
    @property
    private playOnTouchStart = false;

    protected onLoad() {
        const button = this.getComponent(Button);
        if (!Object.values(SoundEffect).includes(this.audioClipKey as SoundEffect)) {
            throw new Error(`Can't find audio clip ${this.audioClipKey}`);
        }
        if (this.playOnTouchStart) {
            this.node.on(Node.EventType.TOUCH_START, () => {
                if (button.interactable) {
                    AudioManager.Instance.playEffect(this.audioClipKey as SoundEffect);
                }
            });
        }
        if (this.playOnTouchEnd) {
            this.node.on(Button.EventType.CLICK, () => AudioManager.Instance.playEffect(this.audioClipKey as SoundEffect));
        }
    }
}
