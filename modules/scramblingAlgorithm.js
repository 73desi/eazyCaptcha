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
/**
 * 扰乱线段生成
 * @param size 验证码尺寸
 * @param baseCode base64编码
 * @returns 处理后的验证码base64编码
 */
function default_1(size, baseCode, disturbingLinesNumber) {
    var _this = this;
    var canvas = (0, canvas_1.createCanvas)(size.x, size.y);
    var ctx = canvas.getContext("2d");
    var loadImages = function () { return __awaiter(_this, void 0, void 0, function () {
        var drawingList, codeImage, mergedImageData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    drawingList = getRandomXy(size, disturbingLinesNumber);
                    drawingList.forEach(function (draw) {
                        ctx.moveTo(draw.startX, draw.startY);
                        ctx.lineTo(draw.endX, draw.endY);
                        ctx.strokeStyle = draw.color;
                        ctx.stroke();
                    });
                    return [4 /*yield*/, (0, canvas_1.loadImage)(baseCode)];
                case 1:
                    codeImage = _a.sent();
                    ctx.drawImage(codeImage, 0, 0);
                    mergedImageData = canvas.toDataURL();
                    // 输出合并后的 Base64 编码图片
                    return [2 /*return*/, mergedImageData];
            }
        });
    }); };
    return loadImages();
}
exports.default = default_1;
/**
 * 获取一组随机线段开始解释的xy值
 * @param size 验证码尺寸
 * @returns 返回线段的坐标
 */
function getRandomXy(size, disturbingLinesNumber) {
    var lineSegments = disturbingLinesNumber ? disturbingLinesNumber : Math.round((Math.random() * 3) + 2);
    var lineCoordinates = [];
    for (var i = 0; i < lineSegments; i++) {
        var startX = Math.round(Math.random() * size.x);
        var startY = Math.round(Math.random() * size.y);
        var endX = Math.round(Math.random() * size.x);
        var endY = Math.round(Math.random() * size.y);
        var randomColor = getRandomColor();
        lineCoordinates.push({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            color: randomColor
        });
    }
    return lineCoordinates;
}
// 获得一组随机的颜色
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
