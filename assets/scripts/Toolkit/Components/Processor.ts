import { Component, _decorator } from 'cc';

const { ccclass } = _decorator;

@ccclass
export default abstract class Processor extends Component {
    private static stopSymbol: Symbol = Symbol('STOP');

    private iterator: IterableIterator<Promise<any>> = null;
    private iteratorResult: IteratorResult<Promise<any>, void> = null;

    private pausePromise: Promise<void> = null;
    private resumeResolve: () => void = null;
    private stopResolve: (value: Symbol) => void;
    private finishResolve: (value: void) => void;
    private finishPromise: Promise<void> = null;

    public onPause: () => void = null;
    public onResume: () => void = null;

    public get isRunning(): boolean {
        return !!this.stopResolve;
    }

    public get isPause(): boolean {
        return !!this.resumeResolve;
    }

    /**
     * 執行一個 process
     * @param process 要執行的工作
     * @returns [等待 process完成的 promise, 執行後可中斷工作的函式]
     */
    public static run<T>(process: Generator<Promise<any>, T, any>): [Promise<T>, (value: void) => void] {
        let stopResolve: (value: Symbol) => void;
        const stopPromise = new Promise<Symbol>((resolve) => {
            stopResolve = resolve;
        });
        return [
            (async () => {
                const iterator = process;
                let iteratorResult = iterator.next();
                let value: any;
                while (!iteratorResult.done) {
                    value = await Promise.race([iteratorResult.value, stopPromise]);
                    if (value === Processor.stopSymbol) {
                        break;
                    }
                    iteratorResult = iterator.next(value);
                }
                return value;
            })(),
            () => stopResolve(Processor.stopSymbol),
        ];
    }

    /**
     * Start the process
     */
    public async play(...params: any): Promise<any> {
        if (this.isRunning) {
            return;
        }
        const stopPromise = new Promise((resolve) => {
            this.stopResolve = resolve;
        });
        this.iterator = this.run(...params);
        this.iteratorResult = this.iterator.next();

        let isStopManually = false;
        while (!this.iteratorResult.done) {
            await this.pausePromise;
            const value: any = await Promise.race([this.iteratorResult.value, stopPromise]);
            if (value === Processor.stopSymbol) {
                isStopManually = true;
                break;
            }
            this.iteratorResult = this.iterator.next(value);
        }

        // 判斷 process是否被中斷或自然結束
        if (!isStopManually) {
            this.stop(true, true);
        }
    }

    public pause() {
        if (this.isPause) {
            return;
        }
        this.onPause?.();
        this.pausePromise = new Promise((resolve) => {
            this.resumeResolve = resolve;
        });
    }

    public resume() {
        if (!this.isPause) {
            return;
        }
        this.onResume?.();
        this.resumeResolve();
        this.resumeResolve = null;
    }

    /**
     * Stop the process if it is running.
     */
    public async stop(waitForFinish = true, isEndNaturely = false) {
        if (!this.isRunning) {
            return;
        }
        this.stopResolve?.(Processor.stopSymbol);
        this.stopResolve = null;
        this.resumeResolve = null;
        this.pausePromise = null;
        if (waitForFinish) {
            await this.finish(isEndNaturely);
        } else {
            this.finish(isEndNaturely);
        }
        this.finishResolve?.();
    }

    /**
     * Return a promise which will fullfill after the process stopped or finished.
     */
    public waitForFinish() {
        if (!this.isRunning) {
            return Promise.resolve();
        }
        if (!this.finishPromise) {
            this.finishPromise = new Promise<void>((resolve) => {
                this.finishResolve = resolve;
            }).then(() => {
                this.finishPromise = null;
            });
        }
        return this.finishPromise;
    }

    /** Write implementation of your process here. */
    protected abstract run(...params: any): Generator<Promise<any>, any, any>;

    /** Write implemetation of what should be done after the process stopped or finished. */
    protected abstract finish(isEndNaturely: boolean): Promise<void>;
}
