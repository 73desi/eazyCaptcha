"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var normalDrawing_1 = require("../modules/normalDrawing");
/**
 * 计算验证码内容处理
 * @param config 配置文件
 * @returns 验证码内容
 */
function calculateCode(config) {
    if ((config === null || config === void 0 ? void 0 : config.codeType) === 'calculate') {
        config.characterString = processingText(config.characterString);
        return (0, normalDrawing_1.default)(config, false);
    }
}
exports.default = calculateCode;
function processingText(formula) {
    if (formula) {
        try {
            eval(formula);
            return formula;
        }
        catch (error) {
            return getFormula();
        }
    }
    else {
        return getFormula();
    }
}
function getFormula() {
    var calculationType = Math.floor(Math.random() * 3);
    var formula = '';
    switch (calculationType) {
        case 0:
            formula = generateOperation(1);
            break;
        case 1:
            formula = generateOperation(2);
            break;
        case 2:
            formula = generateOperation(3);
            break;
        default:
            break;
    }
    return formula;
}
function generateOperation(length) {
    var symbolList = ['+', '-', '*'];
    var formula = '';
    for (var i = 0; i < length; i++) {
        var number = Math.floor(Math.random() * 10) + 1;
        var symbol = symbolList[Math.floor(Math.random() * symbolList.length)];
        formula += number.toString() + symbol;
    }
    var lastNumber = Math.floor(Math.random() * 10) + 1;
    formula += lastNumber.toString();
    return formula;
}
