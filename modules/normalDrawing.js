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
var scramblingAlgorithm_1 = require("./scramblingAlgorithm");
/**
 * 生成默认类型验证码
 * @param config 验证码配置
 * @param needHandle 需要处理
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
function default_1(config, needHandle) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, codeSize, characterString, codeBackImage, colorGroup, disturbingLinesNumber, rotationAngle, delimiter, canvasSize, stringArray, canvas, ctx, coordinateSystem, whiteSpace, maximumWidthOfCharacters, maximumHeightOfCharacters, str, cString, finalSynthesis, finalCtx, path, url, codeImage_1, codeImage, crypto, uniqueId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = config, codeSize = _a.codeSize, characterString = _a.characterString, codeBackImage = _a.codeBackImage, colorGroup = _a.colorGroup, disturbingLinesNumber = _a.disturbingLinesNumber, rotationAngle = _a.rotationAngle;
                    delimiter = codeSize.indexOf('x') !== -1 ? 'x' : '*';
                    canvasSize = {
                        x: parseInt(codeSize.split(delimiter)[0]),
                        y: parseInt(codeSize.split(delimiter)[1])
                    };
                    stringArray = needHandle ? JSON.parse(characterString) : characterString.split('');
                    canvas = (0, canvas_1.createCanvas)(canvasSize.x, canvasSize.y);
                    ctx = canvas.getContext("2d");
                    coordinateSystem = [];
                    whiteSpace = {
                        topOrBottom: canvasSize.y * 0.1,
                        leftOrRight: canvasSize.x * 0.2
                    };
                    maximumWidthOfCharacters = (canvasSize.x - whiteSpace.leftOrRight * 2) / stringArray.length;
                    maximumHeightOfCharacters = canvasSize.y - whiteSpace.topOrBottom * 2;
                    // 开始配置坐标系
                    stringArray.forEach(function (item, index) {
                        // 定义最大文字高
                        var bigLetterSize = maximumHeightOfCharacters * 0.6;
                        // 记录是否存在较大字符
                        var havaBigLetter = false;
                        get(havaBigLetter);
                        function get(havaBigLetter) {
                            // 定义拿到的坐标
                            var newCoordinate = randomCoordinates(item, index, {
                                x: maximumWidthOfCharacters,
                                y: maximumHeightOfCharacters
                            }, needHandle, havaBigLetter, rotationAngle);
                            // 坐标还原
                            newCoordinate.x = newCoordinate.x + whiteSpace.topOrBottom;
                            newCoordinate.y = newCoordinate.y + whiteSpace.leftOrRight;
                            var maxy = canvasSize.y - whiteSpace.topOrBottom;
                            // 判断是不是超出范围是就重新拿
                            if (newCoordinate.fontSize > bigLetterSize) {
                                newCoordinate.fontSize = bigLetterSize;
                                havaBigLetter = true;
                                coordinateSystem.push(newCoordinate);
                                // 判断字体是不是过小，是的话调整大小
                            }
                            if (newCoordinate.fontSize < bigLetterSize / 2) {
                                newCoordinate.fontSize = bigLetterSize * Math.random();
                                coordinateSystem.push(newCoordinate);
                            }
                            if (newCoordinate.y > canvasSize.y - (whiteSpace.topOrBottom * 2)) {
                                newCoordinate.y = maxy - (newCoordinate.fontSize / 2);
                                coordinateSystem.push(newCoordinate);
                            }
                            else {
                                coordinateSystem.push(newCoordinate);
                            }
                        }
                    });
                    // 绘制背景
                    ctx.fillStyle = 'rgba(0,0,0,0)';
                    ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
                    coordinateSystem.forEach(function (item, index) {
                        var color = Array.isArray(colorGroup) ? colorGroup.length == 1 ? colorGroup[0] : Math.round(Math.random() * (colorGroup.length - 1)) === 0 ? '#000' : colorGroup[Math.round(Math.random() * (colorGroup.length - 1))] : colorGroup;
                        // 绘制文本
                        ctx.save();
                        ctx.fillStyle = color;
                        ctx.translate(item.x + (whiteSpace.leftOrRight / 2), item.y + whiteSpace.topOrBottom);
                        ctx.rotate(item.roat);
                        ctx.font = "".concat(item.fontSize, "px Cabin");
                        ctx.fillText(item.text, 0, 0);
                        ctx.restore();
                    });
                    str = '';
                    stringArray.forEach(function (code) {
                        str += code;
                    });
                    return [4 /*yield*/, (0, scramblingAlgorithm_1.default)(canvasSize, ctx.canvas.toDataURL(), disturbingLinesNumber)
                        // 创建最终合并canvas
                    ];
                case 1:
                    cString = _b.sent();
                    finalSynthesis = (0, canvas_1.createCanvas)(canvasSize.x, canvasSize.y);
                    finalCtx = finalSynthesis.getContext("2d");
                    path = isFileExists(codeBackImage);
                    url = isURL(codeBackImage);
                    if (!(path || url)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, canvas_1.loadImage)(codeBackImage)];
                case 2:
                    codeImage_1 = _b.sent();
                    finalCtx.drawImage(codeImage_1, 0, 0);
                    return [3 /*break*/, 4];
                case 3:
                    // 不是的话就填充颜色
                    finalCtx.fillStyle = codeBackImage;
                    finalCtx.fillRect(0, 0, canvasSize.x, canvasSize.y);
                    _b.label = 4;
                case 4: return [4 /*yield*/, (0, canvas_1.loadImage)(cString)];
                case 5:
                    codeImage = _b.sent();
                    finalCtx.drawImage(codeImage, 0, 0);
                    crypto = require('crypto');
                    uniqueId = crypto.randomBytes(16).toString('hex');
                    needHandle ? (0, verificationCodeManager_1.default)(uniqueId, 'set', 'character', str) : (0, verificationCodeManager_1.default)(uniqueId, 'set', 'calculate', eval(characterString));
                    // 返回信息
                    return [2 /*return*/, {
                            verificationCode: finalCtx.canvas.toDataURL(),
                            verificationCodeHex: uniqueId,
                            codeSize: codeSize,
                            status: true,
                            codeType: needHandle ? 'character' : 'calculate'
                        }];
            }
        });
    });
}
exports.default = default_1;
/**
 * 随机极坐标
 * @param text 文本内容
 * @param index 数量
 * @param max 最大值
 * @param needHandle 是否需要处理
 * @param havaBigLetter 是否存在大字符
 * @returns 返回极坐标内容
 */
function randomCoordinates(text, index, max, needHandle, havaBigLetter, rotationAngle) {
    var r = Math.random() * rotationAngle;
    var R = Math.random() > 0.5 ? r : -r;
    if (needHandle) {
        var fontSize = havaBigLetter ? max.y / 4 : Math.random() * max.x + Math.random() * 500;
        var sqrt = Math.sqrt(fontSize);
        var x = Math.floor(Math.random() * max.x) - sqrt + (index * max.x);
        var y = Math.floor(Math.random() * max.y) + sqrt;
        return { text: text, x: x, y: y, fontSize: fontSize, roat: R };
    }
    else {
        return { text: text, x: max.x * 0.75 + (index * max.x), y: max.y * 0.56, fontSize: max.y * 0.4, roat: R };
    }
}
// 判断字符串是否是标准URL
function isURL(str) {
    try {
        new URL(str);
        return true;
    }
    catch (err) {
        return false;
    }
}
// 判断文件是否存在
function isFileExists(filePath) {
    var path = require('path');
    var fs = require('fs');
    var resolvedPath = path.resolve(filePath);
    try {
        fs.accessSync(resolvedPath, fs.constants.F_OK);
        return resolvedPath;
    }
    catch (err) {
        return false;
    }
}
