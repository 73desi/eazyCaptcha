import { codeConfig, codeResult } from "../index";
/**
 * 生成点击验证码
 * @param config 验证码配置
 * @returns 返回结果 {verificationCode:验证码base64编码,verificationCodeHex:返回唯一的16为hex值}
 */
export default function (config: codeConfig): Promise<codeResult>;
