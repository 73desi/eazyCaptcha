
import { codeConfig, codeResult } from "../index";
import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";
interface coordinateSystemTelp { text: string; x: number; y: number; fontSize: number, roat: number }
import verificationCodeManager from "./verificationCodeManager";
import scramblingAlgorithm from "./scramblingAlgorithm";
/**
 * 生成默认类型验证码
 * @param config 验证码配置
 * @param needHandle 需要处理
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
export default async function (config: codeConfig, needHandle: boolean) {
    const { codeSize, characterString, codeBackImage, colorGroup, disturbingLinesNumber, rotationAngle } = config as {
        characterString: string, codeSize: string,
        codeBackImage: string, rotationAngle: number,
        disturbingLinesNumber: number, colorGroup: string | string[],
    }
    // 获取分隔符
    const delimiter: string = codeSize.indexOf('x') !== -1 ? 'x' : '*';
    // 验证码宽高确定
    var canvasSize = {
        x: parseInt(codeSize.split(delimiter)[0]),
        y: parseInt(codeSize.split(delimiter)[1])
    }
    // 把验证码字符处理为字符串数组
    const stringArray: string[] = needHandle ? JSON.parse(characterString) : characterString.split('')
    // 创建canvas
    const canvas = createCanvas(canvasSize.x, canvasSize.y);
    // 获取到canvas上下文
    var ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // 定义验证码坐标合集
    var coordinateSystem: coordinateSystemTelp[] = [];
    // 空白区域
    const whiteSpace = {
        topOrBottom: canvasSize.y * 0.1,
        leftOrRight: canvasSize.x * 0.2
    }
    // 每个字符最大宽度
    const maximumWidthOfCharacters: number = (canvasSize.x - whiteSpace.leftOrRight * 2) / stringArray.length;
    // 每个字符最大高度
    const maximumHeightOfCharacters: number = canvasSize.y - whiteSpace.topOrBottom * 2;
    // 开始配置坐标系
    stringArray.forEach((item, index) => {
        // 定义最大文字高
        const bigLetterSize = maximumWidthOfCharacters * 0.6
        // 记录是否存在较大字符
        var havaBigLetter: boolean = false
        get(havaBigLetter)
        function get(havaBigLetter: boolean) {
            // 定义拿到的坐标
            const newCoordinate = randomCoordinates(item, index, {
                x: maximumWidthOfCharacters,
                y: maximumHeightOfCharacters
            }, needHandle, havaBigLetter, rotationAngle)
            // 坐标还原
            newCoordinate.x = newCoordinate.x + whiteSpace.topOrBottom
            newCoordinate.y = newCoordinate.y + whiteSpace.leftOrRight
            // 判断是不是超出范围是就重新拿
            if (newCoordinate.y > maximumHeightOfCharacters) {
                return get(havaBigLetter)
                // 判断是不是大字符是的话调整大小
            } else if (newCoordinate.fontSize > bigLetterSize) {
                newCoordinate.fontSize = newCoordinate.y - bigLetterSize / 2
                havaBigLetter = true
                coordinateSystem.push(newCoordinate)
                // 判断字体是不是过小，是的话调整大小
            } else if (newCoordinate.fontSize < bigLetterSize/5) {
                newCoordinate.fontSize = newCoordinate.y + bigLetterSize / 5
                havaBigLetter = true
                coordinateSystem.push(newCoordinate)
            }else {
                coordinateSystem.push(newCoordinate)
            }
        }
    })
    // 绘制背景
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
    coordinateSystem.forEach((item, index) => {
        const color = Array.isArray(colorGroup) ? colorGroup.length == 1 ? colorGroup[0] : Math.round(Math.random() * (colorGroup.length - 1)) === 0 ? '#000' : colorGroup[Math.round(Math.random() * (colorGroup.length - 1))] : colorGroup
        // 绘制文本
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(item.x + (whiteSpace.leftOrRight / 2), item.y + whiteSpace.topOrBottom)
        ctx.rotate(item.roat)
        ctx.font = `${item.fontSize}px Cabin`;
        ctx.fillText(item.text, 0, 0);
        ctx.restore();
    })
    var str = <string>''
    stringArray.forEach(code => {
        str += code
    })
    // 扰乱线段添加
    const cString = await scramblingAlgorithm(canvasSize, ctx.canvas.toDataURL(), disturbingLinesNumber)
    // 创建最终合并canvas
    const finalSynthesis = createCanvas(canvasSize.x, canvasSize.y);
    const finalCtx = finalSynthesis.getContext("2d");
    // 检测是不是urk或者本地路径
    const path = isFileExists(codeBackImage) as string
    const url = isURL(codeBackImage)
    // 如果是url或者本地路径就将图片传入
    if (path || url) {
        // 设置定义背景
        const codeImage = await loadImage(codeBackImage)
        finalCtx.drawImage(codeImage, 0, 0)
    } else {
        // 不是的话就填充颜色
        finalCtx.fillStyle = codeBackImage;
        finalCtx.fillRect(0, 0, canvasSize.x, canvasSize.y);
    }
    const codeImage = await loadImage(cString);
    finalCtx.drawImage(codeImage, 0, 0);
    // 随机生成一个哈希值对应这个验证码
    const crypto = require('crypto');
    const uniqueId = crypto.randomBytes(16).toString('hex');
    needHandle ? verificationCodeManager(uniqueId, 'set', 'character', str) : verificationCodeManager(uniqueId, 'set', 'calculate', eval(characterString))
    // 返回信息
    return {
        verificationCode: finalCtx.canvas.toDataURL(),
        verificationCodeHex: uniqueId,
        codeSize,
        status: true,
        codeType: needHandle ? 'character' : 'calculate'
    } as codeResult
}

/**
 * 随机极坐标
 * @param text 文本内容
 * @param index 数量
 * @param max 最大值
 * @param needHandle 是否需要处理
 * @param havaBigLetter 是否存在大字符
 * @returns 返回极坐标内容
 */
function randomCoordinates(text: string, index: number, max: { x: number, y: number }, needHandle: boolean, havaBigLetter: boolean, rotationAngle: number) {
    const r = Math.random() * rotationAngle
    const R = Math.random() > 0.5 ? r : -r
    if (needHandle) {
        const fontSize = havaBigLetter ? max.y / 4 : Math.random() * max.x + Math.random() * 500;
        const sqrt = Math.sqrt(fontSize)
        const x = Math.floor(Math.random() * max.x) - sqrt + index * max.x;
        const y = Math.floor(Math.random() * max.y) + sqrt;
        return { text, x, y, fontSize, roat: R }
    } else {
        return { text, x: max.x * 0.75, y: max.y * 0.56, fontSize: max.y * 0.4, roat: R }
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
    const path = require('path')
    const fs = require('fs')
    const resolvedPath = path.resolve(filePath);
    try {
        fs.accessSync(resolvedPath, fs.constants.F_OK);
        return resolvedPath;
    } catch (err) {
        return false;
    }
}