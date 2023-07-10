import { codeConfig, defaultCodeConfig } from "../index";
import normalDrawing from "../modules/normalDrawing";
/**
 * 字符验证码处理
 * @param config 配置文件
 * @returns 验证码内容
 */
export default function characterCode(config: codeConfig) {
    if (config?.codeType === 'character') {
        config.characterString = processingText(config.characterString, config.characterLength)
        return normalDrawing(config as codeConfig, true)
    }
}


/**
 * 处理字符或字符串为字符数组
 * @param characterGroup 传入的字符串
 * @param characterLength 生成的字符串长度
 */
function processingText(characterGroup?: string | string[], characterLength?: number) {
    var stringArray = <string[]>[];
    const CodeLength = characterLength || characterGroup?.length || 4;
    if (!characterGroup) {
        stringArray = randomString()
    } else {
        if (Array.isArray(characterGroup)) {
            stringArray = characterGroup
        } else {
            stringArray = characterGroup.indexOf(',') !== -1 ? characterGroup.split(',') : characterGroup.split('')
        }
    }
    const array = stringArray.length > CodeLength ? stringArray.slice(0, 4) : stringArray
    return JSON.stringify(array)
}




/**
 * 获取一个随机的四位字符串数组
 * @returns 字符数组
 */
function randomString() {
    const lowercaseChars = 'abcdefghijklmnpqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
    const numericChars = '123456789';
    let code = <string[]>[];

    // 生成一个小写字母
    const randomLowercaseIndex = Math.floor(Math.random() * lowercaseChars.length);
    code.push(lowercaseChars.charAt(randomLowercaseIndex))

    // 生成一个数字
    const randomNumericIndex = Math.floor(Math.random() * numericChars.length);
    code.push(numericChars.charAt(randomNumericIndex))

    // 生成两个大写字母
    for (let i = 0; i < 2; i++) {
        const randomUppercaseIndex = Math.floor(Math.random() * uppercaseChars.length);
        code.push(uppercaseChars.charAt(randomUppercaseIndex))
    }
    code = shuffleString(code);
    return code;
}
// 随机排列字符串的函数
function shuffleString(array: string[]) {
    let currentIndex = array.length;
    let temporaryValue: string, randomIndex: number;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}