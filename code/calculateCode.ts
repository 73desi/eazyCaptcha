import { codeConfig, defaultCodeConfig } from "../index";
import normalDrawing from "../modules/normalDrawing";
/**
 * 计算验证码内容处理
 * @param config 配置文件
 * @returns 验证码内容
 */
export default function calculateCode(config:codeConfig) {
    if (config?.codeType === 'calculate') {
        config.characterString = processingText(config.characterString as string)
        return normalDrawing(config as codeConfig, false)
    }
}
function processingText(formula: string) {
    if (formula) {
        try {
            eval(formula);
            return formula
        } catch (error) {
            return getFormula()
        }
    } else {
        return getFormula()
    }
}
function getFormula(): string {
    const calculationType = Math.floor(Math.random() * 3);
    let formula = '';

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

function generateOperation(length: number): string {
    const symbolList = ['+', '-', '*'];
    let formula = '';

    for (let i = 0; i < length; i++) {
        const number = Math.floor(Math.random() * 10) + 1;
        const symbol = symbolList[Math.floor(Math.random() * symbolList.length)];
        formula += number.toString() + symbol;
    }

    const lastNumber = Math.floor(Math.random() * 10) + 1;
    formula += lastNumber.toString();

    return formula;
}
