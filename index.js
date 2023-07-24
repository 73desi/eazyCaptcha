"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.validate = exports.generateCode = exports.defaultCodeConfig = void 0;
var characterCode_1 = require("./code/characterCode");
var calculateCode_1 = require("./code/calculateCode");
var slideAndClickCode_1 = require("./code/slideAndClickCode");
var verificationCodeManager_1 = require("./modules/verificationCodeManager");
/**
 * 验证码默认配置
 */
exports.defaultCodeConfig = {
    codeType: 'character', characterString: '', characterLength: 4,
    rotationAngle: 0, disturbingLinesNumber: 3, codeBackImage: '#fff',
    colorGroup: ['#dc3545', '#0dcaf0', '#ffc107', '#198', '#0d6efd'],
    codeSize: '300*150', matchCase: true, rangeValue: 20
};
/**
 * 验证码方法
 * @param config 验证码配置文件，可省略，省略则为字符类`character`验证码
*/
function generateCode(config) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var _a, slideRes, clickRes;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // 检测部分特殊值
                    if ((config === null || config === void 0 ? void 0 : config.codeType) === "slide" || (config === null || config === void 0 ? void 0 : config.codeType) === "click") {
                        if (!config.codeBackImage) {
                            return [2 /*return*/, reject("当codeType值为`slide`和`click`时，characterString必须使用图片url或路径")];
                        }
                    }
                    if ((config === null || config === void 0 ? void 0 : config.rotationAngle) && (config === null || config === void 0 ? void 0 : config.rotationAngle) > 1 || (config === null || config === void 0 ? void 0 : config.rotationAngle) && (config === null || config === void 0 ? void 0 : config.rotationAngle) < -1) {
                        return [2 /*return*/, reject("不推荐将rotationAngle设置超过范围的值，会导致转转角度过大")];
                    }
                    // 补充默认元素，防止元素不完整
                    config = __assign(__assign({}, exports.defaultCodeConfig), config);
                    _a = config === null || config === void 0 ? void 0 : config.codeType;
                    switch (_a) {
                        case 'character': return [3 /*break*/, 1];
                        case 'calculate': return [3 /*break*/, 2];
                        case 'slide': return [3 /*break*/, 3];
                        case 'click': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1:
                    resolve((0, characterCode_1.default)(config));
                    _b.label = 2;
                case 2:
                    resolve((0, calculateCode_1.default)(config));
                    _b.label = 3;
                case 3: return [4 /*yield*/, (0, slideAndClickCode_1.default)(config)];
                case 4:
                    slideRes = _b.sent();
                    (slideRes === null || slideRes === void 0 ? void 0 : slideRes.status) ? resolve(slideRes) : reject(slideRes === null || slideRes === void 0 ? void 0 : slideRes.verificationCode);
                    _b.label = 5;
                case 5: return [4 /*yield*/, (0, slideAndClickCode_1.default)(config)];
                case 6:
                    clickRes = _b.sent();
                    (clickRes === null || clickRes === void 0 ? void 0 : clickRes.status) ? resolve(clickRes) : reject(clickRes === null || clickRes === void 0 ? void 0 : clickRes.verificationCode);
                    _b.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); });
}
exports.generateCode = generateCode;
/**
 * 验证码验证
 * @param hex 唯一哈希值
 * @param value 验证内容字符串或者xy坐标或者xy坐标数组
 * @param finalConfigurationFile 配置文件
 * @returns
 */
function validate(hex, value, config) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = (0, verificationCodeManager_1.default)(hex, 'validate', null, value, __assign(__assign({}, exports.defaultCodeConfig), config));
            if (res.status) {
                resolve({
                    status: res.status,
                    hex: res.hex
                });
            }
            else {
                reject({
                    status: res.status,
                    hex: res.hex
                });
            }
            return [2 /*return*/];
        });
    }); });
}
exports.validate = validate;
