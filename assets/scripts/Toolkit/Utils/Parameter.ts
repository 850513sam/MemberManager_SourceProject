/**
 * 從 queryString取得目標 value
 * @param param 目標 key
 */
function getParamSearch(param: string): string {
    return new URL(document.location.href).searchParams.get(param);
}

namespace Parameter {
    /**
     * 取得目標 value，若是找不到則回傳 default value
     * @param paramKey 目標 key
     * @param defaultValue 預設值
     */
    export function get(paramKey: string, defaultValue: string = null) 
    {
        if (!getParamSearch(paramKey) || getParamSearch(paramKey) == "")
        {
            return defaultValue;
        }
        return getParamSearch(paramKey);
    }
}

export default Parameter;
