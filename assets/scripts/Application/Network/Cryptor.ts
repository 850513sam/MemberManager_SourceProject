import { error } from 'cc';
import CryptoJS from 'crypto-js';

/**
 * 加解密工具
 */
export default class Cryptor {
    private _key: string = '';
    private _backupKey: string = '';

    public set key(rawKey: string) {
        this._backupKey = this._key;
        this._key = rawKey.repeat(Math.ceil(this.validKeyLength / rawKey.length)).substring(0, this.validKeyLength);
    }

    constructor(key: string, private validKeyLength: number) {
        this.key = key;
    }

    public encrypt(plainText: string): string {
        return CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(this._key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        }).toString();
    }

    public decrypt(cipherText: string): string {
        let plainText: string = '';
        try {
            plainText = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(this._key), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            }).toString(CryptoJS.enc.Utf8);
        } catch (err: any) {
            error(err);
        }

        // use backup key
        if (plainText === '') {
            plainText = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(this._backupKey), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            }).toString(CryptoJS.enc.Utf8);
        }
        return plainText;
    }

    public getSHA256Hash(text: string): string {
        return CryptoJS.SHA256(text).toString();
    }
}
