export namespace ErrorUtils {
    export function findErrorBy(name: string): ICustomError;
    export function findErrorBy(code: number): ICustomError;
    export function findErrorBy(arg: string | number): ICustomError {
        if (typeof arg === 'number') {
            return errorList.find((error) => error.code === arg);
        }
        return errorList.find((error) => error.name === arg);
    }
}

export enum CustomErrorName {
    OPERATE_TIMEOUT = 'operate timeout',
    CONNECTION_TIMEOUT = 'connection timeout',
    FRONT_END_ERROR = 'front end error',
    CONNECTION_FAILED = 'connection failed',
    LOADING_FAILED = 'loading failed',
    TIMEOUT = 'connection timeout',
    GAME_PAUSE = '遊戲暫停',
    ROUND_CANCEL = '該局取消',

    BET_LIMIT_EXCEED = 'bet exceed bet limit',
    TABLE_LIMIT_EXCEED = 'bet exceed table limit',
    INSUFFICIENT_BALANCE = 'insufficient balance',
    TABLE_IS_FULL = 'table is full',
}

type ICustomError = {
    name: string;
    code: number;
    type: 'GameState' | 'Fatal' | 'Hint' | 'Ignore';
};

const errorList: ICustomError[] = [
    // front end
    {
        name: CustomErrorName.FRONT_END_ERROR,
        code: 1000,
        type: 'Fatal',
    },
    {
        name: CustomErrorName.CONNECTION_FAILED,
        code: 1001,
        type: 'Fatal',
    },
    {
        name: CustomErrorName.LOADING_FAILED,
        code: 1002,
        type: 'Fatal',
    },
    {
        name: CustomErrorName.OPERATE_TIMEOUT,
        code: 1003,
        type: 'Fatal',
    },
    {
        name: CustomErrorName.GAME_PAUSE,
        code: 1098,
        type: 'GameState',
    },
    {
        name: CustomErrorName.ROUND_CANCEL,
        code: 1099,
        type: 'Hint',
    },
    // common
    {
        name: 'authorization failed',
        code: 2001,
        type: 'Fatal',
    },
    {
        name: 'update betting failed',
        code: 2002,
        type: 'Fatal',
    },
    {
        name: 'no table found',
        code: 2003,
        type: 'Hint',
    },
    {
        name: 'hall not found',
        code: 2004,
        type: 'Hint',
    },
    {
        name: 'table is full',
        code: 2005,
        type: 'Fatal',
    },
    {
        name: 'client already exist',
        code: 2006,
        type: 'Fatal',
    },
    {
        name: 'table is not empty',
        code: 2007,
        type: 'Fatal',
    },
    {
        name: 'entry table failed',
        code: 2008,
        type: 'Hint',
    },
    {
        name: 'player already in the table',
        code: 2009,
        type: 'Fatal',
    },
    {
        name: 'operate not allow',
        code: 2010,
        type: 'Ignore',
    },
    {
        name: CustomErrorName.INSUFFICIENT_BALANCE,
        code: 2011,
        type: 'Hint',
    },
    {
        name: 'client not exist',
        code: 2012,
        type: 'Ignore',
    },
    {
        name: 'table is closed',
        code: 2013,
        type: 'Hint',
    },
    {
        name: 'client is closing',
        code: 2014,
        type: 'Ignore',
    },
    {
        name: 'client is closed',
        code: 2015,
        type: 'Ignore',
    },
    {
        name: 'client message chan is full',
        code: 2016,
        type: 'Fatal',
    },
    {
        name: 'serialize data failed',
        code: 2017,
        type: 'Fatal',
    },
    {
        name: 'parse body failed',
        code: 2018,
        type: 'Fatal',
    },
    {
        name: 'validate body failed',
        code: 2019,
        type: 'Fatal',
    },
    {
        name: 'internal server error',
        code: 2020,
        type: 'Fatal',
    },
    {
        name: 'during game maintenance',
        code: 2021,
        type: 'Fatal',
    },
    {
        name: 'call backend error',
        code: 2022,
        type: 'Fatal',
    },
    {
        name: 'request should be encrypted',
        code: 2023,
        type: 'Fatal',
    },
    {
        name: 'wrong token, please login again',
        code: 2024,
        type: 'Fatal',
    },
    {
        name: 'game not found',
        code: 2025,
        type: 'Fatal',
    },
    {
        name: 'parse json error',
        code: 2026,
        type: 'Fatal',
    },
    {
        name: 'redis internal error',
        code: 2027,
        type: 'Fatal',
    },
    {
        name: 'operate not allow',
        code: 2028,
        type: 'Fatal',
    },
    // error code
    {
        name: '3000',
        code: 3301,
        type: 'Fatal',
    },
    {
        name: '3001',
        code: 3302,
        type: 'Hint',
    },
    {
        name: '3002',
        code: 3303,
        type: 'Fatal',
    },
    {
        name: '3003',
        code: 3304,
        type: 'Fatal',
    },
    {
        name: '4000',
        code: 3305,
        type: 'Fatal',
    },
    {
        name: '4001',
        code: 3306,
        type: 'Fatal',
    },
    {
        name: '4002',
        code: 3307,
        type: 'Fatal',
    },
    {
        name: '4006',
        code: 3308,
        type: 'Fatal',
    },
    {
        name: '5000',
        code: 3309,
        type: 'Fatal',
    },
    {
        name: '5001',
        code: 3310,
        type: 'Fatal',
    },
    {
        name: '-1000',
        code: 3311,
        type: 'Ignore',
    },
    {
        name: 'idle for too long',
        code: null,
        type: 'Fatal',
    },
    // sicbo
    {
        name: 'dice shaker operator error',
        code: 2100,
        type: 'GameState',
    },
    {
        name: 'dice shaker query error',
        code: 2101,
        type: 'GameState',
    },
    {
        name: 'config incompatible for game',
        code: 2102,
        type: 'Fatal',
    },
    {
        name: 'banker not found in the queue',
        code: 2103,
        type: 'Hint',
    },
    {
        name: 'dice results are not available',
        code: 2108,
        type: 'Hint',
    },
    {
        name: 'game stopped',
        code: 2109,
        type: 'Hint',
    },
    {
        name: CustomErrorName.BET_LIMIT_EXCEED,
        code: 2110,
        type: 'Hint',
    },
    {
        name: CustomErrorName.TABLE_LIMIT_EXCEED,
        code: 2111,
        type: 'Hint',
    },
];
