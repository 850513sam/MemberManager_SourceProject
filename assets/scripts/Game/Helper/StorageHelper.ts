import { warn } from 'cc';
import Application from '../../Application/Application';

export enum StoragePath {
    AudioSetting = 'AudioSetting',
    MemberSetting = "MemberSetting",
}

namespace StorageHelper {
    export function saveToLocal(key: StoragePath, data: Object) {
        try {
            localStorage.setItem(`${Application.Instance.config.gameName}/${key}`, JSON.stringify(data));
        } catch (error) {
            warn(error);
        }
    }

    export function loadFromLocal(key: StoragePath): any {
        try {
            return JSON.parse(localStorage.getItem(`${Application.Instance.config.gameName}/${key}`));
        } catch (error) {
            warn(error);
            return null;
        }
    }

    export function clearLocal() {
        localStorage.clear();
    }
}

export default StorageHelper;
