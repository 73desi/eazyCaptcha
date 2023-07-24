/**
 * 扰乱线段生成
 * @param size 验证码尺寸
 * @param baseCode base64编码
 * @returns 处理后的验证码base64编码
 */
export default function (size: {
    x: number;
    y: number;
}, baseCode: string, disturbingLinesNumber: number): Promise<string>;
