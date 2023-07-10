import { StringifyOptions } from "querystring";
import characterCode from "./code/characterCode";
import calculateCode from "./code/calculateCode";
import slideAndClickCode from "./code/slideAndClickCode";

/**
 * @param codeType 可选值：字符`character`、计算`calculate`、滑动`slide`、点击`click`
 */
export type CodeType = 'character' | 'calculate' | 'slide' | 'click'
/**
 * 验证码配置项
 * @param codeType 验证码类型，`character` 、 `calculate` 、 `slide` 、 `click`默认`character`
 * @param characterString 验证码字符串、字符数组,不传入则随机生成一组,可以为中文、英文、数字、特殊符号，如果是`click`类型则为上方的字
 * @param codeSize 验证码尺寸支持`200*100`和`200*100`俩种格式,默认`300*150`
 * @param codeBackImage 验证码的背景图片或者颜色，如果是`slide`、`click`验证码必须传入图片url,默认'#fff',支持16进制的颜色值
 * @param characterLength 字符长度,默认`4`,除`slide`以外都生效
 * @param rotationAngle 旋转角度,默认`0`,可以在`1`~`-1`之间选择，不推荐超过这个值
 * @param disturbingLinesNumber 扰乱线条数,只在`character`和`calculate`生效
 * @param colorGroup 颜色组,默认`#dc3545,#0dcaf0,#ffc107,#19875,#0d6efd`,支持16进制的颜色值
 */
export interface codeConfig {
    codeType?: CodeType, characterString?: string,
    codeSize?: string, codeBackImage?: string,
    characterLength?: number, rotationAngle?: number,
    disturbingLinesNumber?: number,
    colorGroup?: string | string[]
}

/**
 * 验证码默认配置
 */
export const defaultCodeConfig: codeConfig =
{
    codeType: 'character', characterString: '', characterLength: 4,
    rotationAngle: 0, disturbingLinesNumber: 3, codeBackImage: '#fff',
    colorGroup: ['#dc3545', '#0dcaf0', '#ffc107', '#198', '#0d6efd'],
    codeSize: '300*150'
}
/**
 * 结束导出内容
 */
export interface codeResult {
    verificationCode: string | {
        break: string,
        front: string,
        startHeight: number,
    },
    codeSize: string,
    verificationCodeHex: string,
    status: boolean,
    codeType: CodeType
}
/**
 * 验证码方法
 * @param config 验证码配置文件，可省略，省略则为字符类`character`验证码
*/
export default (config?: codeConfig) => {
    return new Promise(async (resolve, reject) => {
        // 检测部分特殊值
        if (config?.codeType === "slide" || config?.codeType === "click") {
            if (!config.codeBackImage) {
                return reject("当codeType值为`slide`和`click`时，characterString必须使用图片url或路径");
            }
        }
        if (config?.rotationAngle && config?.rotationAngle > 1 || config?.rotationAngle && config?.rotationAngle < -1) {
            return reject("不推荐将rotationAngle设置超过范围的值，会导致转转角度过大");
        }
        // 补充默认元素，防止元素不完整
        config = { ...defaultCodeConfig, ...config }

        switch (config?.codeType as string) {
            case 'character':
                resolve(characterCode(config));
            case 'calculate':
                resolve(calculateCode(config));
            case 'slide':
                const slideRes = await slideAndClickCode(config)
                slideRes?.status ? resolve(slideRes) : reject(slideRes?.verificationCode)
            case 'click':
                const clickRes = await slideAndClickCode(config)
                clickRes?.status ? resolve(clickRes) : reject(clickRes?.verificationCode)
        }
    })
}