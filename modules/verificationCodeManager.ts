type handle = 'set' | 'validate'
var verificationCodeStorage: { key: string, value: string | object, type: string }[] = []
/**
 * 管理验证码
 * @param hex hex值
 * @param value 验证码验证内容
 * @param type 验证码类型
 * @param handle 需要进行的操作
 */
export default (hex: string, handle: handle, type?: string, value?: string | object) => {
    if (handle === 'set') {
        if (value) {
            verificationCodeStorage.push({ key: hex, value, type:type as string })
        } else {
            return console.log('需要设置项value')
        }
    } else {
        return verificationCodeStorage.find(item => item.key === hex)?.value;
    }
}
