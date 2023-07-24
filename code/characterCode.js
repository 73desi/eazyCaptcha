"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var normalDrawing_1 = require("../modules/normalDrawing");
/**
 * 字符验证码处理
 * @param config 配置文件
 * @returns 验证码内容
 */
function characterCode(config) {
    if ((config === null || config === void 0 ? void 0 : config.codeType) === 'character') {
        config.characterString = processingText(config.characterString, config.characterLength);
        return (0, normalDrawing_1.default)(config, true);
    }
}
exports.default = characterCode;
/**
 * 处理字符或字符串为字符数组
 * @param characterGroup 传入的字符串
 * @param characterLength 生成的字符串长度
 */
function processingText(characterGroup, characterLength) {
    var stringArray = [];
    var CodeLength = characterLength || (characterGroup === null || characterGroup === void 0 ? void 0 : characterGroup.length) || 4;
    if (!characterGroup) {
        stringArray = randomString();
    }
    else {
        if (Array.isArray(characterGroup)) {
            stringArray = characterGroup;
        }
        else {
            stringArray = characterGroup.indexOf(',') !== -1 ? characterGroup.split(',') : characterGroup.split('');
        }
    }
    var array = stringArray.length > CodeLength ? stringArray.slice(0, 4) : stringArray;
    return JSON.stringify(array);
}
/**
 * 获取一个随机的四位字符串数组
 * @returns 字符数组
 */
function randomString() {
    var lowercaseChars = 'abcdefghijklmnpqrstuvwxyz';
    var uppercaseChars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
    var numericChars = '123456789';
    var code = [];
    // 生成一个小写字母
    var randomLowercaseIndex = Math.floor(Math.random() * lowercaseChars.length);
    code.push(lowercaseChars.charAt(randomLowercaseIndex));
    // 生成一个数字
    var randomNumericIndex = Math.floor(Math.random() * numericChars.length);
    code.push(numericChars.charAt(randomNumericIndex));
    // 生成两个大写字母
    for (var i = 0; i < 2; i++) {
        var randomUppercaseIndex = Math.floor(Math.random() * uppercaseChars.length);
        code.push(uppercaseChars.charAt(randomUppercaseIndex));
    }
    code = shuffleString(code);
    return code;
}
// 随机排列字符串的函数
function shuffleString(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
