import { codeConfig, codeResult } from "../index";
import { createCanvas, loadImage, CanvasRenderingContext2D, Canvas } from "canvas";
import verificationCodeManager from "./verificationCodeManager";
interface xyTemlate {
    x: number,
    y: number
}
interface processed { x: number, y: number, fontSize: number, r: number }
/**
 * 生成点击验证码
 * @param config 验证码配置
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
export default async function (config: codeConfig) {
    const { codeSize, codeBackImage, characterString, colorGroup, rotationAngle } = config as {
        codeBackImage: string, codeSize: string,
        colorGroup: string | string[], characterString: string,
        rotationAngle: number
    }
    // 获取分隔符
    const delimiter: string = codeSize.indexOf('x') !== -1 ? 'x' : '*';
    // 验证码宽高确定
    var canvasSize = {
        x: parseInt(codeSize.split(delimiter)[0]),
        y: parseInt(codeSize.split(delimiter)[1])
    }
    // 定义上下左右不会生成的区域
    const blankValue = {
        x: Math.round(canvasSize.x / 6),
        y: Math.round(canvasSize.y / 8)
    }
    // 定义最大范围值
    const max = {
        x: canvasSize.x - blankValue.x,
        y: canvasSize.y - blankValue.y
    }
    // 获取字符串长度随机数或者获取随机的2-4个的二维坐标
    var coordinateList: xyTemlate[] = aSetOfRandomCoordinates(max, characterString.length, rotationAngle)
    coordinateList.forEach(coordinate => {
        const maxX = blankValue.x * 5
        const minX = blankValue.x
        const x = coordinate.x + blankValue.x
        if (x < minX) additivex()
        if (x > maxX) minusx()
        function additivex() {
            coordinate.x += blankValue.x
            if (coordinate.x < minX) {
                additivex()
            }
        }
        function minusx() {
            coordinate.x -= blankValue.x
            if (coordinate.x > maxX) {
                minusx()
            }
        }
        const maxY = blankValue.y * 7
        const minY = blankValue.y * 3
        const y = coordinate.y + blankValue.y
        if (y < minY) additivey()
        if (y > maxY) minusy()
        function additivey() {
            coordinate.y += blankValue.y
            if (coordinate.y < minY) {
                additivey()
            }
        }
        function minusy() {
            coordinate.y -= blankValue.y
            if (coordinate.y > maxY) {
                minusy()
            }
        }
        coordinate.x += blankValue.x*.5
        coordinate.y += blankValue.y
    });
    // 创建canvas
    const canvasVerificationCode = createCanvas(canvasSize.x, canvasSize.y);
    //创建对应上下文
    const ctxVerificationCode: CanvasRenderingContext2D = canvasVerificationCode.getContext("2d");
    // 设置定义背景
    const codeImage = await loadImage(codeBackImage)
    const color = Array.isArray(colorGroup) ? colorGroup.length == 1 ? colorGroup[0] : Math.round(Math.random() * (colorGroup.length - 1)) === 0 ? '#000' : colorGroup[Math.round(Math.random() * (colorGroup.length - 1))] : colorGroup
    // 把图片、点击点渲染到canvas
    const b = drawClick(ctxVerificationCode, coordinateList as processed[], color, blankValue.x * .3, canvasVerificationCode, characterString)
    //设置背景后的图片
    ctxVerificationCode.drawImage(codeImage, 0, 0)
    const crypto = require('crypto');
    const uniqueId = crypto.randomBytes(16).toString('hex')
    verificationCodeManager(uniqueId, 'set', 'click', coordinateList)
    return {
        verificationCode: b.canvas.toDataURL(),
        verificationCodeHex: uniqueId,
        codeSize: codeSize,
        status: true,
        codeType: 'click'
    } as codeResult
}
/**
 * 渲染canvas
 * @param ctx canvas上下文
 * @param coordinateList 二维坐标列表
 * @param colorGroup 颜色组
 * @param radius 半径
 * @param canvas canvas对象
 * @param saveOrNot 是否保存
 * @param characterString 传入的字符串
 * @returns 返回处理好的ctx对象
 */
function drawClick(ctx: CanvasRenderingContext2D, coordinateList: processed[], color: string, radius: number, canvas: Canvas, characterString: string) {
    // // 第一个半圆
    coordinateList.forEach((coor, index) => {
        if (characterString) {
            if (characterString[index]) {
                ctx.save();
                ctx.fillStyle = color;
                ctx.translate(coor.x, coor.y)
                ctx.font = `${coor.fontSize}px Cabin`;
                ctx.fillText(characterString[index], 0, 0);
                ctx.strokeStyle = '#fff';
                ctx.stroke();
                ctx.restore();
            }
        } else {
            ctx.beginPath();
            ctx.arc(coor.x, coor.y, radius, 0, 2 * Math.PI, true);
            ctx.lineWidth = 2;
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }
        ctx.globalCompositeOperation = "destination-over";
    });
    return ctx
}
/**
 * 获取一组随机数量的二维坐标
 * @param max 最大坐标
 * @param index 传入字符串长度
 * @param rotationAngle 旋转角范围
 * @returns 返回坐标组
 */
function aSetOfRandomCoordinates(max: xyTemlate, index: number, rotationAngle: number) {
    const randomNumberOfCopies = getRandom()
    function getRandom(): number {
        const num = index ? index + 1 : Math.floor(Math.random() * 100) % 5
        if (!num || num < 2) {
            return getRandom()
        } else {
            return num
        }
    }
    var copiesList = <xyTemlate[]>[]
    const singleSize = <xyTemlate>{
        x: max.x / randomNumberOfCopies,
        y: max.y / 100
    }
    for (let i = 0; i < randomNumberOfCopies; i++) {
        var startCoordinate = <xyTemlate>{}
        startCoordinate.y = singleSize.y
        if (i == 0) {
            startCoordinate.x = 0
        } else {
            startCoordinate.x = copiesList[i - 1].x + singleSize.x
        }
        const random = <xyTemlate>{
            x: startCoordinate.x + Math.round(Math.random() * singleSize.x),
            y: startCoordinate.y + Math.round(Math.random() * max.y),
            fontSize: index ? max.x * .3 : 0,
            r: index ? (Math.random() > 0.5 ? Math.random() * rotationAngle : - Math.random() * rotationAngle) : 0,
        }
        copiesList.push(random)
    }
    return copiesList
}