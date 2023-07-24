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
 * 生成点击验证码
 * @param config 验证码配置
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
function default_1(config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, codeSize, codeBackImage, characterString, colorGroup, rotationAngle, delimiter, canvasSize, blankValue, max, coordinateList, canvasVerificationCode, ctxVerificationCode, codeImage, color, b, crypto, uniqueId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = config, codeSize = _a.codeSize, codeBackImage = _a.codeBackImage, characterString = _a.characterString, colorGroup = _a.colorGroup, rotationAngle = _a.rotationAngle;
                    delimiter = codeSize.indexOf('x') !== -1 ? 'x' : '*';
                    canvasSize = {
                        x: parseInt(codeSize.split(delimiter)[0]),
                        y: parseInt(codeSize.split(delimiter)[1])
                    };
                    blankValue = {
                        x: Math.round(canvasSize.x / 6),
                        y: Math.round(canvasSize.y / 8)
                    };
                    max = {
                        x: canvasSize.x - blankValue.x,
                        y: canvasSize.y - blankValue.y
                    };
                    coordinateList = aSetOfRandomCoordinates(max, characterString.length, rotationAngle);
                    coordinateList.forEach(function (coordinate) {
                        var maxX = blankValue.x * 5;
                        var minX = blankValue.x;
                        var x = coordinate.x + blankValue.x;
                        if (x < minX)
                            additivex();
                        if (x > maxX)
                            minusx();
                        function additivex() {
                            coordinate.x += blankValue.x;
                            if (coordinate.x < minX) {
                                additivex();
                            }
                        }
                        function minusx() {
                            coordinate.x -= blankValue.x;
                            if (coordinate.x > maxX) {
                                minusx();
                            }
                        }
                        var maxY = blankValue.y * 7;
                        var minY = blankValue.y * 3;
                        var y = coordinate.y + blankValue.y;
                        if (y < minY)
                            additivey();
                        if (y > maxY)
                            minusy();
                        function additivey() {
                            coordinate.y += blankValue.y;
                            if (coordinate.y < minY) {
                                additivey();
                            }
                        }
                        function minusy() {
                            coordinate.y -= blankValue.y;
                            if (coordinate.y > maxY) {
                                minusy();
                            }
                        }
                        coordinate.x += blankValue.x * .5;
                        coordinate.y += blankValue.y;
                    });
                    canvasVerificationCode = (0, canvas_1.createCanvas)(canvasSize.x, canvasSize.y);
                    ctxVerificationCode = canvasVerificationCode.getContext("2d");
                    return [4 /*yield*/, (0, canvas_1.loadImage)(codeBackImage)];
                case 1:
                    codeImage = _b.sent();
                    color = Array.isArray(colorGroup) ? colorGroup.length == 1 ? colorGroup[0] : Math.round(Math.random() * (colorGroup.length - 1)) === 0 ? '#000' : colorGroup[Math.round(Math.random() * (colorGroup.length - 1))] : colorGroup;
                    b = drawClick(ctxVerificationCode, coordinateList, color, blankValue.x * .3, canvasVerificationCode, characterString);
                    //设置背景后的图片
                    ctxVerificationCode.drawImage(codeImage, 0, 0);
                    crypto = require('crypto');
                    uniqueId = crypto.randomBytes(16).toString('hex');
                    (0, verificationCodeManager_1.default)(uniqueId, 'set', 'click', coordinateList);
                    return [2 /*return*/, {
                            verificationCode: b.canvas.toDataURL(),
                            verificationCodeHex: uniqueId,
                            codeSize: codeSize,
                            status: true,
                            codeType: 'click'
                        }];
            }
        });
    });
}
exports.default = default_1;
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
function drawClick(ctx, coordinateList, color, radius, canvas, characterString) {
    // // 第一个半圆
    coordinateList.forEach(function (coor, index) {
        if (characterString) {
            if (characterString[index]) {
                ctx.save();
                ctx.fillStyle = color;
                ctx.translate(coor.x, coor.y);
                ctx.font = "".concat(coor.fontSize, "px Cabin");
                ctx.fillText(characterString[index], 0, 0);
                ctx.strokeStyle = '#fff';
                ctx.stroke();
                ctx.restore();
            }
        }
        else {
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
    return ctx;
}
/**
 * 获取一组随机数量的二维坐标
 * @param max 最大坐标
 * @param index 传入字符串长度
 * @param rotationAngle 旋转角范围
 * @returns 返回坐标组
 */
function aSetOfRandomCoordinates(max, index, rotationAngle) {
    var randomNumberOfCopies = getRandom();
    function getRandom() {
        var num = index ? index + 1 : Math.floor(Math.random() * 100) % 5;
        if (!num || num < 2) {
            return getRandom();
        }
        else {
            return num;
        }
    }
    var copiesList = [];
    var singleSize = {
        x: max.x / randomNumberOfCopies,
        y: max.y / 100
    };
    for (var i = 0; i < randomNumberOfCopies; i++) {
        var startCoordinate = {};
        startCoordinate.y = singleSize.y;
        if (i == 0) {
            startCoordinate.x = 0;
        }
        else {
            startCoordinate.x = copiesList[i - 1].x + singleSize.x;
        }
        var random = {
            x: startCoordinate.x + Math.round(Math.random() * singleSize.x),
            y: startCoordinate.y + Math.round(Math.random() * max.y),
            fontSize: index ? max.x * .3 : 0,
            r: index ? (Math.random() > 0.5 ? Math.random() * rotationAngle : -Math.random() * rotationAngle) : 0,
        };
        copiesList.push(random);
    }
    return copiesList;
}
