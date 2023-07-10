import { codeConfig,codeResult } from "../index";
import { createCanvas, loadImage, CanvasRenderingContext2D, Canvas } from "canvas";
import verificationCodeManager from "./verificationCodeManager";
interface xyTemlate {
    x: number,
    y: number
}
/**
 * 生成点击验证码
 * @param config 验证码配置
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
export default async function (config: codeConfig) {
    const { codeSize, characterString, colorGroup } = config as {
        characterString: string, codeSize: string,
        colorGroup: string|string[],
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
    // 获取随机的2-4个的二维坐标
    var coordinateList: xyTemlate[] = aSetOfRandomCoordinates(max)
    coordinateList.forEach(coordinate => {
        const maxX = blankValue.x * 5
        if (coordinate.x > maxX) minusx()
        function minusx() {
            const x = coordinate.x - blankValue.x
            coordinate.x = x
            if (x > maxX) {
                minusx()
            }
        }
        if (coordinate.x < blankValue.x) coordinate.x = coordinate.x + blankValue.x
        if (coordinate.y > blankValue.y * 7) minusy()
        function minusy() {
            const y = coordinate.y - blankValue.y
            coordinate.y = y
            if (y > max.y) {
                minusy()
            }
        }
        if (coordinate.y < blankValue.y) coordinate.y = coordinate.y + blankValue.y
    });
    // 创建canvas
    const canvasVerificationCode = createCanvas(canvasSize.x, canvasSize.y);
    //创建对应上下文
    const ctxVerificationCode: CanvasRenderingContext2D = canvasVerificationCode.getContext("2d");
    // 设置定义背景
    const codeImage = await loadImage(characterString)
    const color = Array.isArray(colorGroup) ? colorGroup.length == 1 ? colorGroup[0] : Math.round(Math.random() * (colorGroup.length - 1)) === 0 ? '#000' : colorGroup[Math.round(Math.random() * (colorGroup.length - 1))] : colorGroup
    // 把图片、点击点渲染到canvas
    const b = drawPath(ctxVerificationCode, coordinateList, color, blankValue.x * .3, canvasVerificationCode)
    //设置背景后的图片
    ctxVerificationCode.drawImage(codeImage, 0, 0)
    const crypto = require('crypto');
    const uniqueId = crypto.randomBytes(16).toString('hex')
    verificationCodeManager(uniqueId, 'set', 'click', coordinateList)
    verificationCodeManager(uniqueId, 'validate')
    return {
        verificationCode: b.canvas.toDataURL(),
        verificationCodeHex: uniqueId,
        codeSize:codeSize,
        status:true,
        codeType:'click'
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
 * @returns 返回处理好的ctx对象
 */
function drawPath(ctx: CanvasRenderingContext2D, coordinateList: xyTemlate[], color: string, radius: number, canvas: Canvas) {
    // // 第一个半圆
    coordinateList.forEach(coor => {
        ctx.beginPath();
        ctx.arc(coor.x, coor.y, radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = 2;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.globalCompositeOperation = "destination-over";
    });
    return ctx
}
/**
 * 获取一组随机数量的二维坐标
 * @param max 最大坐标
 * @returns 返回坐标组
 */
function aSetOfRandomCoordinates(max: xyTemlate) {
    const randomNumberOfCopies = getRandom()
    function getRandom(): number {
        const num = Math.floor(Math.random() * 100) % 5
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
            y: startCoordinate.y + Math.round(Math.random() * max.y)
        }
        copiesList.push(random)
    }
    return copiesList
}