import { AudioClip, AudioSource, Tween, Game, game, Node, NodePool, resources } from 'cc';
import CompositeLoadingTask from '../Toolkit/Helper/LoadingTask/CompositeLoadingTask';
import StorageHelper, { StoragePath } from './Helper/StorageHelper';
import { Music, SoundEffect } from './Config/audio.config';
import { IAudioSetting } from './GameObject/VolumeSetting';

export default class AudioManager {
    private static instance: AudioManager = null;

    private audioSourcePool: NodePool = new NodePool();
    private _audioSourceRoot: Node = null;
    private musicAudioSource: AudioSource = null;
    private audioClipMap: Record<string, AudioClip> = {};
    private _loadingTask: CompositeLoadingTask = null;
    private _isContextRunning = false;
    private _isStartPlaying = false;
    private _deferredPlaylist: (() => void)[] = [];

    // 音量
    private _effectVolume: number = 1;
    private _musicVolume: number = 1;
    // 靜音
    private _effectMute: boolean = false;
    private _musicMute: boolean = false;

    private originMusicVolume = 1;
    private originEffectVolume = 1;

    private constructor() {
        game.on(Game.EVENT_SHOW, () => {
            this.musicVolume = this.originMusicVolume;
            this.effectVolume = this.originEffectVolume;
        });
        game.on(Game.EVENT_HIDE, () => {
            this.originEffectVolume = this.effectVolume;
            this.originMusicVolume = this.musicVolume;
            this.musicVolume = 0;
            this.effectVolume = 0;
        });
    }

    public static get Instance() {
        if (!this.instance) {
            this.instance = new AudioManager();
        }
        return this.instance;
    }

    public get loadingTask() {
        return this._loadingTask;
    }

    public get effectVolume(): number {
        return this.effectMute ? 0 : this._effectVolume;
    }
    public set effectVolume(value: number) {
        this._effectVolume = value;
        this.updateEffectVolume();
    }

    public get musicVolume(): number {
        return this.musicMute ? 0 : this._musicVolume;
    }
    public set musicVolume(value: number) {
        this._musicVolume = value;
        this.updateMusicVolume();
    }

    public get effectMute(): boolean {
        return this._effectMute;
    }

    public set effectMute(mute: boolean) {
        this._effectMute = mute;
        this.updateEffectVolume();
    }

    public get musicMute(): boolean {
        return this._musicMute;
    }

    public set musicMute(mute: boolean) {
        this._musicMute = mute;
        this.updateMusicVolume();
    }

    private get audioSourceRoot() {
        if (!this._audioSourceRoot) {
            this._audioSourceRoot = new Node('AudioSourceRoot');
            game.addPersistRootNode(this.audioSourceRoot);
        }
        return this._audioSourceRoot;
    }

    private get playingEffects() {
        return this.audioSourceRoot.getComponentsInChildren(AudioSource).filter((audioSource) => audioSource !== this.musicAudioSource);
    }

    public async preload() {
        this.applyLocalSetting();
        this._loadingTask = new CompositeLoadingTask(`audio::preload`);
        await this.loadAudioClip();
    }

    public stopEffects(exceptionList: string[] = []) {
        this.playingEffects.filter((effect) => !exceptionList.includes(effect.clip.name)).forEach((effect) => this.recycleAudioSource(effect));
    }

    public recycleAudioSource(audioSource: AudioSource) {
        Tween.stopAllByTarget(audioSource);
        audioSource.stop();
        audioSource.loop = false;
        this.audioSourcePool.put(audioSource.node);
    }

    // 取得可使用的AudioSource
    private getAudioSource(needRecycle = true): AudioSource {
        const node =
            this.audioSourcePool.get() ??
            (() => {
                const newNode = new Node();
                const audioSource = newNode.addComponent(AudioSource);
                audioSource.playOnAwake = false;
                return newNode;
            })();
        if (needRecycle) {
            // 監聽: 播放完畢後回收
            node.once(AudioSource.EventType.ENDED, () => {
                this.recycleAudioSource(node.getComponent(AudioSource));
            });
        }
        this.audioSourceRoot.addChild(node);

        return node.getComponent(AudioSource);
    }

    // 播放背景音樂
    public playMusic(type: Music, isLoop = true): AudioSource {
        const clip = this.audioClipMap[type];
        const audioSource = this.musicAudioSource ?? (this.musicAudioSource = this.getAudioSource(false));
        audioSource.node.name = 'Music';
        if (audioSource.playing) {
            audioSource.stop();
        }
        audioSource.volume = this.musicVolume;
        audioSource.loop = isLoop;
        this._tryToPlay(audioSource, clip);
        return audioSource;
    }

    // 播放音效
    public playEffect(type: SoundEffect, startAt = 0): AudioSource {
        const clip = this.audioClipMap[type];
        const audioSource = this.getAudioSource();
        audioSource.node.name = 'Effect';
        audioSource.volume = this.effectVolume;
        if (startAt < clip.getDuration()) {
            this._tryToPlay(audioSource, clip, startAt);
        } else {
            this.recycleAudioSource(audioSource);
        }
        return audioSource;
    }

    private _tryToPlay(audioSource: AudioSource, clip: AudioClip, startAt = 0) {
        if (!this._isContextRunning) {
            if (!this._isStartPlaying) {
                // first play
                this._isStartPlaying = true;
                this._doPlay(audioSource, clip);
                audioSource.node.once(AudioSource.EventType.STARTED, () => {
                    this._isContextRunning = true;
                    this._deferredPlaylist.forEach(play => play());
                })
            } else {
                // wait for first play start
                this._deferredPlaylist.push(() => this._doPlay(audioSource, clip, startAt));
            }
        } else {
            this._doPlay(audioSource, clip, startAt);
        }
    }

    private _doPlay(audioSource: AudioSource, clip: AudioClip, startAt = 0) {
        audioSource.clip = clip;
        audioSource.play();
        if (startAt !== 0) {
            audioSource.currentTime = startAt;
        }
    }

    // 更新正在播放的音效音量
    private updateEffectVolume(): void {
        const volume = this.effectMute ? 0 : this.effectVolume;
        this.playingEffects.forEach((audioSource) => {
            audioSource.volume = volume;
        });
    }

    // 更新正在播放的BGM音量
    private updateMusicVolume(): void {
        const volume = this.musicMute ? 0 : this._musicVolume;
        if (this.musicAudioSource) {
            this.musicAudioSource.volume = volume;
        }
    }

    private async loadAudioClip() {
        const loadingTask = this._loadingTask.addTask('audio::load-common');
        resources.loadDir(`audioClip/common`, AudioClip, loadingTask.progress.bind(loadingTask), (error, assets) => {
            loadingTask.finish(error);
            if (assets) {
                assets.forEach((audioClip) => {
                    this.audioClipMap[audioClip.name] = audioClip;
                });
            }
        });
        return loadingTask.waitForFinish();
    }

    private applyLocalSetting() {
        const localAudioSetting = StorageHelper.loadFromLocal(StoragePath.AudioSetting) as IAudioSetting;
        if (localAudioSetting) {
            const { effectMute, musicMute, effectVolume, musicVolume } = localAudioSetting;
            this._effectMute = effectMute;
            this._effectVolume = effectVolume;
            this._musicMute = musicMute;
            this._musicVolume = musicVolume;
        }
    }
}
