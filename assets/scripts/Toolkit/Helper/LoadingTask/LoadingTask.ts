import { EventTarget, log, error } from 'cc';

export default class LoadingTask extends EventTarget {
    private _completeCount: number;
    private _totalCount: number;
    private _isFinished: boolean;
    private _isSuccess: boolean;
    private _error: Error = null;

    constructor(private _name: string) {
        super();
        log(`%c=== Task ${_name} Created ===`, 'color:yellow');
        this._completeCount = 0;
        this._totalCount = 0;
        this._isFinished = false;
        this._isSuccess = false;
    }

    public get name() {
        return this._name;
    }

    public get completeCount() {
        return this._completeCount;
    }

    public get totalCount() {
        return this._totalCount;
    }

    public get isFinished() {
        return this._isFinished;
    }

    public get isSuccess() {
        return this._isSuccess;
    }

    public get error() {
        return this._error;
    }

    public waitForFinish() {
        if (this.isFinished) {
            return (this.isSuccess ? Promise.resolve : Promise.reject)();
        }
        return new Promise<void>((resolve, reject) => {
            this.once('onFinished', () => {
                (this.isSuccess ? resolve : reject)();
            });
        });
    }

    public waitForStart() {
        if (this.completeCount !== 0) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
            this.once('onProgress', resolve);
        });
    }

    public progress(completeCount: number, totalCount: number) {
        this._completeCount = completeCount;
        this._totalCount = totalCount;
        // log(`Task: ${this.name}, progrss: ${((this.completeCount / this.totalCount) * 100).toFixed(2)}%`);
        this.emit('onProgress');
    }

    public finish(err: Error) {
        if (err) {
            error(err);
        }
        this._error = err;
        this._isSuccess = !err;
        this._isFinished = true;
        log(`%c=== Task: ${this.name} finished (${this.isSuccess ? 'Success' : 'Failed'}) ===`, 'color:yellow');
        this.emit('onFinished');
    }
}
