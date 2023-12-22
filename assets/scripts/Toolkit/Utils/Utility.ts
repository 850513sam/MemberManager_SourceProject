import { UITransform } from 'cc';
import { Node } from 'cc';

/**
 * 根據提供的 frame數和 fps，計算出時間
 * @param frame 格數
 * @param fps 預設值為動畫素材的 fps
 * @returns 跑完幀數所需時間(in second)
 */
export function calculateFrameTime(frame: number, fps: number = 30): number {
    return frame / fps;
}

/**
 * 將參數填入字串中，參數位置以 {n}表示，ex. 'You won {0} on extra'
 * @param text 目標字串
 * @param args 目標參數
 */
export function fillTextArgument(text: string, args: string[]): string {
    args.forEach((value, idx) => {
        text = text.replace(new RegExp(`\\{${idx}\\}`, 'g'), value);
    });
    text = text.replace(/\{\d+\}/g, '');
    return text;
}

/**
 * 設置父節點且不更改位置
 * @param child 子節點
 * @param parent 父節點
 */
export function setParentWithoutPositionChange(child: Node, parent: Node) {
    const originWorldPosition = child.parent.getComponent(UITransform).convertToWorldSpaceAR(child.position);
    child.parent = parent;
    child.position = parent.getComponent(UITransform).convertToNodeSpaceAR(originWorldPosition);
}

/**
 * 根據傳入的 host和 args組成 URL
 */
export function joinURL(host: string, ...args: string[]): string {
    let url: string = host;
    args.forEach((arg) => {
        // 判斷是否需要補 '/'
        url += arg.slice(-1) === '/' ? '' : '/';
        // 補上參數
        url += arg[0] === '/' ? arg.slice(1) : arg;
    });
    return url;
}

export function breakValueToSmallerValues(value: number, smallerValues: number[]): number[] {
    const result: number[] = new Array(smallerValues.length).fill(0);
    const originValue = value;
    for (let i = smallerValues.length - 1; i >= 0; i--) {
        if (!smallerValues[i]) {
            continue;
        }
        while (value >= smallerValues[i]) {
            value -= smallerValues[i];
            result[i]++;
        }
        if (value === 0) {
            break;
        }
    }
    // eslint-disable-next-line no-console
    console.assert(
        originValue === result.reduce((pre, cur, idx) => pre + cur * smallerValues[idx], 0),
        `breakValueToSmallerValues failed, originValues: ${originValue}, smallerValues: ${smallerValues}`
    );
    return result;
}

export function deIdentification(str: string, displayLength: number, replaceWith: string) {
    return str
        .split('')
        .map((char) => {
            if (displayLength > 0) {
                if (char.match(/[\u4E00-\u9FFF]/)) {
                    displayLength -= 2;
                } else {
                    displayLength--;
                }
                return char;
            }
            return replaceWith;
        })
        .join('');
}

export function shorten(str: string, displayLength: number) {
    if (getLocaleStringLength(str) <= displayLength) {
        return str;
    }
    displayLength--;
    return `${str
        .split('')
        .map((char) => {
            if (displayLength > 0) {
                if (char.match(/[\u4E00-\u9FFF]/)) {
                    displayLength -= 2;
                    if (displayLength < 0) {
                        return '';
                    }
                } else {
                    displayLength--;
                }
                return char;
            }
            return '';
        })
        .join('')}...`;
}

export function getLocaleStringLength(str: string): number {
    return str.split('').reduce((pre, cur) => pre + (cur.match(/[\u4E00-\u9FFF]/) ? 2 : 1), 0);
}
