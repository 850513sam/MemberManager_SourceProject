import Delay from '../../Utils/Delay';

export default class ProgressOffsetCounter {
    constructor(private _offset: number = 0) {}

    public get offset() {
        return this._offset;
    }

    public async progress(seconds: number): Promise<void> {
        await Delay.resolve((seconds - this._offset) * 1000);
        this._offset = Math.max(0, this._offset - seconds);
    }
}
