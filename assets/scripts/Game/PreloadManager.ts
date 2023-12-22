import { Component, director, ProgressBar, _decorator } from 'cc';
import Application from '../Application/Application';
import I18n from '../I18n/I18n';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import CompositeLoadingTask from '../Toolkit/Helper/LoadingTask/CompositeLoadingTask';
import { CustomErrorName } from '../ErrorHandler/Config/error.config';
import AudioManager from './AudioManager';

const { ccclass, property } = _decorator;

@ccclass('PreloadManager')
export default class PreloadManager extends Component {
    @property(ProgressBar)
    private progressBar: ProgressBar = null;

    private preloadTask = new CompositeLoadingTask('Preload');
    private preloadOnly: boolean = false;

    protected async start() 
    {
        // 開始預載入場景
        I18n.Instance.changeLanguage(Application.Instance.config.language);
        this.preloadTask.addTask(I18n.Instance.loadingTask);
        AudioManager.Instance.preload();
        this.preloadTask.addTask(AudioManager.Instance.loadingTask);
        const preLoadSceneTask = this.preloadTask.addTask('PreloadScene');
        if ((window as any).logoPromise) {
            await (window as any).logoPromise;
        }
        director.preloadScene('Game', preLoadSceneTask.progress.bind(preLoadSceneTask), preLoadSceneTask.finish.bind(preLoadSceneTask));
        // 因為在這之前已經有再載入多語言的資料，所以如果沒有等待 preloadScene開始再顯示進度的話，會有一瞬間是顯示載入多語言資料的進度，因此進度條會卡在快載入完成的地方
        preLoadSceneTask.waitForStart().then(() => 
        {
            // 監聽載入進度與載入完成事件
            this.preloadTask.on('onProgress',() => 
            {
                const progress: number = Math.max(this.progressBar.progress, (this.preloadTask.completeCount / this.preloadTask.totalCount));
                this.progressBar.progress = progress;
                this.reportStatus(progress, 'loading...');
            },
            this);
            this.preloadTask.on('onFinished', async () => 
            {
                this.progressBar.node.active = false;
                this.preloadTask.targetOff(this);
                if (!this.preloadTask.isSuccess) 
                {
                    ErrorHandler.Instance.handle(CustomErrorName.LOADING_FAILED);
                } 
                else 
                {
                    if (this.preloadOnly) 
                    {
                        this.reportStatus(1, 'preload finished');
                        return;
                    }
                    this.startGame(this.reportStatus.bind(this));
                }
            });
        });
    }

    /**
     * 用來回報連線進度的 callback function
     * @param progress 進度值，range 0 ~ 1
     * @param message 進度訊息
     */
    private reportStatus(progress: number, message: string): void 
    {
        this.progressBar.progress = progress;
    }

    public async startGame(reportProgress: (progress: number, message: string) => void) 
    {
        // const { token, platformID, walletTypeID } = Application.Instance.config;
        // reportProgress(0.92, 'connecting to server');
        // await Application.Instance.connection.startConnecting();
        // reportProgress(0.95, 'logining');
        // await Application.Instance.connection.login(token, platformID, walletTypeID, true);
        // reportProgress(1, 'start game');
        // (window as any).removeFooter?.();
        // director.loadScene('Game');
    }
}
