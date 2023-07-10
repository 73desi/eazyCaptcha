import { codeConfig,codeResult } from "../index";
import { createCanvas, loadImage, CanvasRenderingContext2D, Image, Canvas } from "canvas";
import verificationCodeManager from "./verificationCodeManager";

/**
 * 生成拖动类型验证码
 * @param config 验证码配置
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
export default async function (config: codeConfig) {
    const { codeSize, codeBackImage  } = config as {
        codeBackImage: string, codeSize: string
    }
    // 获取分隔符
    const delimiter: string = codeSize.indexOf('x') !== -1 ? 'x' : '*';
    // 验证码宽高确定
    var canvasSize = {
        x: parseInt(codeSize.split(delimiter)[0]),
        y: parseInt(codeSize.split(delimiter)[1])
    }
    // 定义拖动层高度宽度
    const dragLayerSize = {
        x: Math.round(canvasSize.x / 5),
        y: Math.round(canvasSize.y / 7)
    }
    // 随机二维坐标
    const getCoordinate = getRandomCoordinate({
        x: canvasSize.x - (dragLayerSize.x * 2.5),
        y: canvasSize.y - (dragLayerSize.y * 3)
    }, dragLayerSize)
    // 定义Canvas渲染坐标
    const convertPolarCoordinates = {
        x: getCoordinate.x + (dragLayerSize.x * 1.5),
        y: getCoordinate.y + dragLayerSize.y
    }
    // 定义检测起点坐标
    const startVerifyCoordinates = {
        x: convertPolarCoordinates.x,
        y: convertPolarCoordinates.y - (dragLayerSize.x * .4)
    }
    // 定义检测终点坐标
    const endVerifyCoordinates = {
        x: dragLayerSize.x * 1.5, y: dragLayerSize.y * 4.8
    }
    // 创建背景canvas
    const canvasBreak = createCanvas(canvasSize.x, canvasSize.y);
    // 创建拖动canvas
    const canvasFront = createCanvas(canvasSize.x, canvasSize.y);
    //创建对应上下文
    const ctxBreak: CanvasRenderingContext2D = canvasBreak.getContext("2d");
    const ctxFront: CanvasRenderingContext2D = canvasFront.getContext("2d");
    // 设置定义背景
    const codeImage = await loadImage(codeBackImage)
    // 把图片绘制到canvas上
    const b = drawPath(ctxBreak, dragLayerSize, convertPolarCoordinates, true, canvasBreak)
    const c = drawPath(ctxFront, dragLayerSize, convertPolarCoordinates, false, canvasFront)
    // 设置背景后的图片
    ctxBreak.drawImage(codeImage, 0, 0)
    ctxFront.drawImage(codeImage, 0, 0)
    // 设置拖动层的内容
    const imgData = ctxFront.getImageData(startVerifyCoordinates.x, startVerifyCoordinates.y, endVerifyCoordinates.x, endVerifyCoordinates.y)
    canvasFront.width = dragLayerSize.x * 1.5
    canvasFront.height = dragLayerSize.x * 1.6
    // 将拖动层的内容放到内容区里面
    ctxFront.putImageData(imgData, dragLayerSize.x * .1, dragLayerSize.x * .1)
    const crypto = require('crypto');
    const uniqueId = crypto.randomBytes(16).toString('hex')
    verificationCodeManager(uniqueId, 'set', 'calculate', {
        start: startVerifyCoordinates,
        end: endVerifyCoordinates
    })
    verificationCodeManager(uniqueId, 'validate')
    return {
        verificationCode: {
            break: b.canvas.toDataURL(),
            front: c.canvas.toDataURL(),
            startHeight: startVerifyCoordinates.y,
        },
        codeSize,
        verificationCodeHex: uniqueId,
        status:true,
        codeType:'slide'
    } as codeResult
}
/**
 * 画验证码
 * @param ctx canvas上下文
 * @param dragLayerSize 拖动层尺寸
 * @param getCoordinate 左上角极坐标
 * @param type 是否是背景层
 * @param canvas canvas对象
 * @param saveOrNot 是否保存
 * @returns 返回更新的ctx上下文
 */
function drawPath(ctx: CanvasRenderingContext2D, dragLayerSize: { x: number, y: number }, getCoordinate: { x: number, y: number }, type: boolean, canvas: Canvas) {
    const diameter = dragLayerSize.x * .2
    // 起始点
    ctx.moveTo(getCoordinate.x, getCoordinate.y)
    // 第一个半圆
    ctx.arc(getCoordinate.x + (dragLayerSize.x * .5), getCoordinate.y - diameter * .8, diameter, 0.72 * Math.PI, 2.26 * Math.PI)
    // 画线到第二个点
    ctx.lineTo(getCoordinate.x + dragLayerSize.x, getCoordinate.y)
    // 第二条线上的半圆
    ctx.arc(getCoordinate.x + dragLayerSize.x + diameter * .8, getCoordinate.y + (dragLayerSize.x * .5), diameter, 1.21 * Math.PI, 2.78 * Math.PI)
    // 画线到第三个点
    ctx.lineTo(getCoordinate.x + dragLayerSize.x, getCoordinate.y + dragLayerSize.x)
    // 画线到第四个点
    ctx.lineTo(getCoordinate.x, getCoordinate.y + dragLayerSize.x)
    // 点四条线上的半圆
    ctx.arc(getCoordinate.x, getCoordinate.y + (dragLayerSize.x * .5), diameter, 0.5 * Math.PI, 1.5 * Math.PI, true)
    // 闭合路径
    ctx.closePath();
    // 设置填充色
    ctx.fillStyle = "rgba(255,255,255,1)";
    // 设置边框色
    ctx.strokeStyle = "rgba(255,255,255,1)";
    // 渲染边框
    ctx.stroke()
    // 设置层级属性
    ctx.globalCompositeOperation = "destination-over";
    // 判断是否为底层，是的话就填充，不然就剪切为画线的形状
    var name = <string>''
    type ? ctx.fill() : ctx.clip()
    type ? name = 'break' : name = 'front'
    return ctx
}
/**
 * 获取一组随机极坐标
 * @param max 最大高度宽度
 * @param size 验证码高度宽度
 * @returns 返回一组随机极坐标
 */
function getRandomCoordinate(max: { x: number; y: number }, size: { x: number; y: number }) {
    const startPoint = {
        x: Math.random() * (max.x - size.x),
        y: Math.random() * (max.y - size.y)
    };

    if (startPoint.x < 0) {
        startPoint.x = 0;
    } else if (startPoint.x + size.x > max.x) {
        startPoint.x = max.x - size.x;
    }

    if (startPoint.y < 0) {
        startPoint.y = 0;
    } else if (startPoint.y + size.y > max.y) {
        startPoint.y = max.y - size.y;
    }

    return startPoint;
}
