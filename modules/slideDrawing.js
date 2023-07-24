"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("canvas");
var verificationCodeManager_1 = require("./verificationCodeManager");
/**
 * 生成拖动类型验证码
 * @param config 验证码配置
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
function default_1(config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, codeSize, codeBackImage, delimiter, canvasSize, dragLayerSize, getCoordinate, convertPolarCoordinates, startVerifyCoordinates, endVerifyCoordinates, canvasBreak, canvasFront, ctxBreak, ctxFront, codeImage, b, c, imgData, crypto, uniqueId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = config, codeSize = _a.codeSize, codeBackImage = _a.codeBackImage;
                    delimiter = codeSize.indexOf('x') !== -1 ? 'x' : '*';
                    canvasSize = {
                        x: parseInt(codeSize.split(delimiter)[0]),
                        y: parseInt(codeSize.split(delimiter)[1])
                    };
                    dragLayerSize = {
                        x: Math.round(canvasSize.x / 5),
                        y: Math.round(canvasSize.y / 7)
                    };
                    getCoordinate = getRandomCoordinate({
                        x: canvasSize.x - (dragLayerSize.x * 2.5),
                        y: canvasSize.y - (dragLayerSize.y * 3)
                    }, dragLayerSize);
                    convertPolarCoordinates = {
                        x: getCoordinate.x + (dragLayerSize.x * 1.5),
                        y: getCoordinate.y + dragLayerSize.y
                    };
                    startVerifyCoordinates = {
                        x: convertPolarCoordinates.x,
                        y: convertPolarCoordinates.y - (dragLayerSize.x * .4)
                    };
                    endVerifyCoordinates = {
                        x: dragLayerSize.x * 1.5, y: dragLayerSize.y * 4.8
                    };
                    canvasBreak = (0, canvas_1.createCanvas)(canvasSize.x, canvasSize.y);
                    canvasFront = (0, canvas_1.createCanvas)(canvasSize.x, canvasSize.y);
                    ctxBreak = canvasBreak.getContext("2d");
                    ctxFront = canvasFront.getContext("2d");
                    return [4 /*yield*/, (0, canvas_1.loadImage)(codeBackImage)
                        // 把图片绘制到canvas上
                    ];
                case 1:
                    codeImage = _b.sent();
                    b = drawPath(ctxBreak, dragLayerSize, convertPolarCoordinates, true, canvasBreak);
                    c = drawPath(ctxFront, dragLayerSize, convertPolarCoordinates, false, canvasFront);
                    // 设置背景后的图片
                    ctxBreak.drawImage(codeImage, 0, 0);
                    ctxFront.drawImage(codeImage, 0, 0);
                    imgData = ctxFront.getImageData(startVerifyCoordinates.x, startVerifyCoordinates.y, endVerifyCoordinates.x, endVerifyCoordinates.y);
                    canvasFront.width = dragLayerSize.x * 1.5;
                    canvasFront.height = dragLayerSize.x * 1.6;
                    // 将拖动层的内容放到内容区里面
                    ctxFront.putImageData(imgData, dragLayerSize.x * .1, dragLayerSize.x * .1);
                    crypto = require('crypto');
                    uniqueId = crypto.randomBytes(16).toString('hex');
                    (0, verificationCodeManager_1.default)(uniqueId, 'set', 'slide', {
                        start: startVerifyCoordinates,
                        end: endVerifyCoordinates
                    });
                    return [2 /*return*/, {
                            verificationCode: {
                                break: b.canvas.toDataURL(),
                                front: c.canvas.toDataURL(),
                                startHeight: startVerifyCoordinates.y,
                            },
                            codeSize: codeSize,
                            verificationCodeHex: uniqueId,
                            status: true,
                            codeType: 'slide'
                        }];
            }
        });
    });
}
exports.default = default_1;
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
function drawPath(ctx, dragLayerSize, getCoordinate, type, canvas) {
    var diameter = dragLayerSize.x * .2;
    // 起始点
    ctx.moveTo(getCoordinate.x, getCoordinate.y);
    // 第一个半圆
    ctx.arc(getCoordinate.x + (dragLayerSize.x * .5), getCoordinate.y - diameter * .8, diameter, 0.72 * Math.PI, 2.26 * Math.PI);
    // 画线到第二个点
    ctx.lineTo(getCoordinate.x + dragLayerSize.x, getCoordinate.y);
    // 第二条线上的半圆
    ctx.arc(getCoordinate.x + dragLayerSize.x + diameter * .8, getCoordinate.y + (dragLayerSize.x * .5), diameter, 1.21 * Math.PI, 2.78 * Math.PI);
    // 画线到第三个点
    ctx.lineTo(getCoordinate.x + dragLayerSize.x, getCoordinate.y + dragLayerSize.x);
    // 画线到第四个点
    ctx.lineTo(getCoordinate.x, getCoordinate.y + dragLayerSize.x);
    // 点四条线上的半圆
    ctx.arc(getCoordinate.x, getCoordinate.y + (dragLayerSize.x * .5), diameter, 0.5 * Math.PI, 1.5 * Math.PI, true);
    // 闭合路径
    ctx.closePath();
    // 设置填充色
    ctx.fillStyle = "rgba(255,255,255,1)";
    // 设置边框色
    ctx.strokeStyle = "rgba(255,255,255,1)";
    // 渲染边框
    ctx.stroke();
    // 设置层级属性
    ctx.globalCompositeOperation = "destination-over";
    // 判断是否为底层，是的话就填充，不然就剪切为画线的形状
    var name = '';
    type ? ctx.fill() : ctx.clip();
    type ? name = 'break' : name = 'front';
    return ctx;
}
/**
 * 获取一组随机极坐标
 * @param max 最大高度宽度
 * @param size 验证码高度宽度
 * @returns 返回一组随机极坐标
 */
function getRandomCoordinate(max, size) {
    var startPoint = {
        x: Math.random() * (max.x - size.x),
        y: Math.random() * (max.y - size.y)
    };
    if (startPoint.x < 0) {
        startPoint.x = 0;
    }
    else if (startPoint.x + size.x > max.x) {
        startPoint.x = max.x - size.x;
    }
    if (startPoint.y < 0) {
        startPoint.y = 0;
    }
    else if (startPoint.y + size.y > max.y) {
        startPoint.y = max.y - size.y;
    }
    return startPoint;
}
