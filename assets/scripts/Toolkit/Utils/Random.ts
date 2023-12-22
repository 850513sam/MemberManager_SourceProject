namespace Random {
    /**
     * 隨機產生true or false
     */
    export function getBoolean(): boolean {
        return !!Math.trunc(Math.random() * 2);
    }
    /**
     * 依照給予的數值範圍，產生 -maximum ~ maximum的浮點數
     * @param maximum 數值範圍
     * @param allowNegative 是否允許負數
     */
    export function getFloat(maximum: number, allowNegative: boolean = false): number {
        const randomSign: number = getBoolean() ? -1 : 1;
        return Math.random() * maximum * (allowNegative ? randomSign : 1);
    }
    /**
     * 依照給予的數值範圍，產生 -maximum ~ maximum的整數
     * @param maximum 數值範圍
     * @param allowNegative 是否允許負數
     */
    export function getInteger(maximum: number, allowNegative: boolean = false): number {
        const randomSign: number = getBoolean() ? -1 : 1;
        return Math.trunc(Math.random() * (maximum + 1)) * (allowNegative ? randomSign : 1);
    }

    export function Range(min: number, max: number): number 
    {
        // return Math.floor(Math.random() * max) + min;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export default Random;
