/**
 * @param codeType 可选值：字符`character`、计算`calculate`、滑动`slide`、点击`click`
 */
export type CodeType = 'character' | 'calculate' | 'slide' | 'click';
/**
 * 验证码配置项
 * @param codeType 验证码类型，`character` 、 `calculate` 、 `slide` 、 `click`默认`character`
 * @param characterString 验证码字符串、字符数组,不传入则随机生成一组,可以为中文、英文、数字、特殊符号，如果是`click`类型则为上方的字
 * @param codeSize 验证码尺寸支持`200*100`和`200*100`俩种格式,默认`300*150`
 * @param matchCase `character`是否区分大小写
 * @param rangeValue `slide` 、 `click`俩种类型误差值，从+rangeValue到-rangeValue的四个方向的范围值
 * @param codeBackImage 验证码的背景图片或者颜色，如果是`slide`、`click`验证码必须传入图片url,默认'#fff',支持16进制的颜色值
 * @param characterLength 字符长度,默认`4`,除`slide`以外都生效
 * @param rotationAngle 旋转角度,默认`0`,可以在`1`~`-1`之间选择，不推荐超过这个值
 * @param disturbingLinesNumber 扰乱线条数,只在`character`和`calculate`生效
 * @param colorGroup 颜色组,默认`#dc3545,#0dcaf0,#ffc107,#19875,#0d6efd`,支持16进制的颜色值
 */
export interface codeConfig {
    codeType?: CodeType;
    characterString?: string;
    codeSize?: string;
    codeBackImage?: string;
    characterLength?: number;
    rotationAngle?: number;
    disturbingLinesNumber?: number;
    matchCase?: boolean;
    colorGroup?: string | string[];
    rangeValue?: number;
}
/**
 * 验证码默认配置
 */
export declare const defaultCodeConfig: codeConfig;
/**
 * 结束导出内容
 */
export interface codeResult {
    verificationCode: string | {
        break: string;
        front: string;
        startHeight: number;
    };
    codeSize: string;
    verificationCodeHex: string;
    status: boolean;
    codeType: CodeType;
}
/**
 * 验证码方法
 * @param config 验证码配置文件，可省略，省略则为字符类`character`验证码
*/
export declare function generateCode(config?: codeConfig): Promise<unknown>;
/**
 * 验证码验证
 * @param hex 唯一哈希值
 * @param value 验证内容字符串或者xy坐标或者xy坐标数组
 * @param finalConfigurationFile 配置文件
 * @returns
 */
export declare function validate(hex: string, value: string | {
    x: number;
    y: number;
} | {
    x: number;
    y: number;
}[], config?: codeConfig): Promise<unknown>;
