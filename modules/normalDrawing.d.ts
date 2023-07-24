import { codeConfig, codeResult } from "../index";
/**
 * 生成默认类型验证码
 * @param config 验证码配置
 * @param needHandle 需要处理
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
export default function (config: codeConfig, needHandle: boolean): Promise<codeResult>;
