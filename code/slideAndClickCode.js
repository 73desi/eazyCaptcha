"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var slideDrawing_1 = require("../modules/slideDrawing");
var clickDrawing_1 = require("../modules/clickDrawing");
/**
 * 拖动验证码、点击验证码处理
 * @param config 配置文件
 * @param type 类型
 * @returns 返回处理后的对象
 */
function processConfig(config) {
    if ((config === null || config === void 0 ? void 0 : config.codeType) === 'slide' || (config === null || config === void 0 ? void 0 : config.codeType) === 'click') {
        // 判断codeBackImage关键字是否存在
        if (config === null || config === void 0 ? void 0 : config.codeBackImage) {
            // 定义需要关键字
            var codeBackImage = config.codeBackImage;
            // 定义是否是url还是本地路径
            var path_1 = isFileExists(codeBackImage);
            var url = isURL(codeBackImage);
            // 如果是url或者本地路径就将路径传入
            if (path_1 || url) {
                config.codeBackImage = path_1 ? path_1 : codeBackImage;
                if ((config === null || config === void 0 ? void 0 : config.codeType) === 'slide') {
                    return (0, slideDrawing_1.default)(config);
                }
                else {
                    return (0, clickDrawing_1.default)(config);
                }
            }
            else {
                return {
                    status: false,
                    verificationCode: 'codeBackImage属性检测失败，请检查是否是URL或者文件路径'
                };
            }
        }
        else {
            return {
                status: false,
                verificationCode: '在滑动验证码中需要保证codeBackImage属性是URL或者文件路径'
            };
        }
    }
}
exports.default = processConfig;
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
    var resolvedPath = path.resolve(filePath);
    try {
        fs.accessSync(resolvedPath, fs.constants.F_OK);
        return resolvedPath;
    }
    catch (err) {
        return false;
    }
}
