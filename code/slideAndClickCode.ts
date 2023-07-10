import * as fs from 'fs';
import * as path from 'path';
import { codeConfig, defaultCodeConfig } from "../index";
import slideDrawing from "../modules/slideDrawing";
import clickDrawing from "../modules/clickDrawing";
/**
 * 拖动验证码、点击验证码处理
 * @param config 配置文件
 * @param type 类型
 * @returns 返回处理后的对象
 */
export default function processConfig(config: codeConfig) {
    if (config?.codeType === 'slide' || config?.codeType === 'click') {
        // 判断codeBackImage关键字是否存在
        if (config?.codeBackImage) {
            // 定义需要关键字
            const codeBackImage = config.codeBackImage as string;
            // 定义是否是url还是本地路径
            const path = isFileExists(codeBackImage) as string
            const url = isURL(codeBackImage)
            // 如果是url或者本地路径就将路径传入
            if (path || url) {
                config.codeBackImage = path ? path : codeBackImage;
                if (config?.codeType === 'slide') {
                    return slideDrawing(config);
                } else {
                    return clickDrawing(config)
                }
            } else {
                return {
                    status:false,
                    verificationCode:'codeBackImage属性检测失败，请检查是否是URL或者文件路径'
                };
            }
        } else {
            return {
                status:false,
                verificationCode: '在滑动验证码中需要保证codeBackImage属性是URL或者文件路径'
            };
        }
    }
}

// 判断字符串是否是标准URL
function isURL(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch (err) {
        return false;
    }
}

// 判断文件是否存在
function isFileExists(filePath: string): boolean | string {
    const resolvedPath = path.resolve(filePath);
    try {
        fs.accessSync(resolvedPath, fs.constants.F_OK);
        return resolvedPath;
    } catch (err) {
        return false;
    }
}