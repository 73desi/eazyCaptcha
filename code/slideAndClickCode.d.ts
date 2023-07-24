import { codeConfig } from "../index";
/**
 * 拖动验证码、点击验证码处理
 * @param config 配置文件
 * @param type 类型
 * @returns 返回处理后的对象
 */
export default function processConfig(config: codeConfig): Promise<import("../index").codeResult> | {
    status: boolean;
    verificationCode: string;
};
