import { CodeType, codeConfig } from "../index";
type handle = 'set' | 'validate';
/**
 * 管理验证码
 * @param hex hex值
 * @param value 验证码验证内容
 * @param type 验证码类型
 * @param handle 需要进行的操作
 */
declare const _default: (hex: string, handle: handle, type?: CodeType, value?: string | object, finalConfigurationFile?: codeConfig) => void | {
    status: boolean;
    hex: string;
};
export default _default;
