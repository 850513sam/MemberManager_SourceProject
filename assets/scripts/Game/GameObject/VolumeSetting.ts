
import { _decorator, Component, Node, Button, Slider, Sprite } from 'cc';
import AnimatedPage from '../../Toolkit/Components/Page/AnimatedPage';
import AudioManager from '../AudioManager';
import StorageHelper, { StoragePath } from '../Helper/StorageHelper';
const { ccclass, property } = _decorator;

export interface IAudioSetting {
    musicVolume: number;
    effectVolume: number;
    musicMute: boolean;
    effectMute: boolean;
}

@ccclass('VolumeSetting')
export class VolumeSetting extends AnimatedPage {
    @property(Button)
    private soundMuteButton: Button = null;
    @property(Button)
    private BGMMuteButton: Button = null;
    @property(Slider)
    private soundVolumeSlider: Slider = null;
    @property(Sprite)
    private soundVolumeSliderFill: Sprite = null;
    @property(Slider)
    private BGMVolumeSlider: Slider = null;
    @property(Sprite)
    private BGMVolumeSliderFill: Sprite = null;

    private static readonly defaultAudioSetting: IAudioSetting = {
        musicVolume: 1,
        effectVolume: 1,
        musicMute: false,
        effectMute: false,
    };

    private currentAudioSetting: IAudioSetting;

    protected onLoad(): void {
        super.onLoad();
        this.handleVolumeSlider();

        this.soundMuteButton.node.on(Button.EventType.CLICK, this.switchSoundMute.bind(this));
        this.BGMMuteButton.node.on(Button.EventType.CLICK, this.switchBGMMute.bind(this));
    }

    protected start() {
        this.loadAndApplyAudioSetting();
        this.initUI();
    }

    private initUI() {
        // volume and mute
        this.updateVolumeSlider();
    }

    private updateVolumeSlider() {
        if (AudioManager.Instance.effectMute) {
            this.soundVolumeSlider.progress = 0;
            this.soundVolumeSliderFill.fillRange = 0;
        } else {
            this.soundVolumeSlider.progress = AudioManager.Instance.effectVolume;
            this.soundVolumeSliderFill.fillRange = this.soundVolumeSlider.progress;
        }
        if (AudioManager.Instance.musicMute) {
            this.BGMVolumeSlider.progress = 0;
            this.BGMVolumeSliderFill.fillRange = 0;
        } else {
            this.BGMVolumeSlider.progress = AudioManager.Instance.musicVolume;
            this.BGMVolumeSliderFill.fillRange = this.BGMVolumeSlider.progress;
        }
    }

    private handleVolumeSlider() {
        this.soundVolumeSlider.node.on('slide', () => {
            const volume = this.soundVolumeSlider.progress;
            AudioManager.Instance.effectMute = false;
            AudioManager.Instance.effectVolume = volume;
            this.currentAudioSetting.effectMute = false;
            this.currentAudioSetting.effectVolume = volume;
            this.soundVolumeSliderFill.fillRange = volume;
            this.saveAudioSetting();
        });
        this.BGMVolumeSlider.node.on('slide', () => {
            const volume = this.BGMVolumeSlider.progress;
            AudioManager.Instance.musicMute = false;
            AudioManager.Instance.musicVolume = volume;
            this.currentAudioSetting.musicMute = false;
            this.currentAudioSetting.musicVolume = volume;
            this.BGMVolumeSliderFill.fillRange = volume;
            this.saveAudioSetting();
        });
    }

    // 切換音效 靜音/50%音量
    private switchSoundMute() {
        if (!AudioManager.Instance.effectMute) {
            AudioManager.Instance.effectMute = true;
            this.currentAudioSetting.effectMute = true;
            this.soundVolumeSlider.progress = 0;
            this.soundVolumeSliderFill.fillRange = 0;
        } else {
            AudioManager.Instance.effectMute = false;
            this.currentAudioSetting.effectMute = false;
            this.soundVolumeSlider.progress = AudioManager.Instance.effectVolume;
            this.soundVolumeSliderFill.fillRange = this.soundVolumeSlider.progress;
        }
        this.saveAudioSetting();
    }

    // 切換BGM 靜音/50%音量
    private switchBGMMute() {
        if (!AudioManager.Instance.musicMute) {
            AudioManager.Instance.musicMute = true;
            this.currentAudioSetting.musicMute = true;
            this.BGMVolumeSlider.progress = 0;
            this.BGMVolumeSliderFill.fillRange = 0;
        } else {
            AudioManager.Instance.musicMute = false;
            this.currentAudioSetting.musicMute = false;
            this.BGMVolumeSlider.progress = AudioManager.Instance.musicVolume;
            this.BGMVolumeSliderFill.fillRange = this.BGMVolumeSlider.progress;
        }
        this.saveAudioSetting();
    }

    // model operation
    private saveAudioSetting() {
        StorageHelper.saveToLocal(StoragePath.AudioSetting, this.currentAudioSetting);
    }

    private loadAndApplyAudioSetting() {
        this.currentAudioSetting = StorageHelper.loadFromLocal(StoragePath.AudioSetting) ?? VolumeSetting.defaultAudioSetting;
        const { effectVolume, musicVolume, effectMute, musicMute }: IAudioSetting = this.currentAudioSetting;

        // volume and mute
        AudioManager.Instance.effectVolume = effectVolume;
        AudioManager.Instance.musicVolume = musicVolume;
        AudioManager.Instance.effectMute = effectMute;
        AudioManager.Instance.musicMute = musicMute;
    }
}