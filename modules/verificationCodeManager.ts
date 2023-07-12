import { CodeType, codeConfig } from "../index";
type handle = 'set' | 'validate'
var verificationCodeStorage: { key: string, value: string | object, type: CodeType }[] = []
/**
 * 管理验证码
 * @param hex hex值
 * @param value 验证码验证内容
 * @param type 验证码类型
 * @param handle 需要进行的操作
 */
export default (hex: string, handle: handle, type?: CodeType, value?: string | object, finalConfigurationFile?: codeConfig) => {
    if (handle === 'set') {
        if (value) {
            verificationCodeStorage.push({ key: hex, value, type })
        } else {
            return console.log('需要设置项value')
        }
    } else {
        const code = verificationCodeStorage.find(item => item.key === hex)
        interface xyTemlate { x: number, y: number }
        switch (code.type) {
            case 'character':
                if (finalConfigurationFile && !finalConfigurationFile.matchCase) {
                    value = value.toString().toLowerCase()
                    code.value = code.value.toString().toLowerCase()
                }
                return value == code.value ? {
                    status: true,
                    hex
                } : {
                    status: false,
                    hex
                };
            case "calculate":
                return value == code.value ? {
                    status: true,
                    hex
                } : {
                    status: false,
                    hex
                }
            case "slide":
                if (typeof value !== 'object') {
                    return {
                        status: false,
                        hex: '注意，slide类型验证码需要是一个包含左上角xy值的二维坐标对象,例如{x:1,y:2}'
                    }
                } else {
                    const { x, y } = value as xyTemlate
                    const { start } = code.value as { start: xyTemlate }
                    const offsetValue = finalConfigurationFile.rangeValue
                    if (x + offsetValue > start.x && start.x < x - offsetValue && y + offsetValue > start.y && start.y < y - offsetValue) {
                        return {
                            status: false,
                            hex
                        }
                    } else {
                        return {
                            status: true,
                            hex
                        }
                    }
                }
            case "click":
                if (Array.isArray(value)) {
                    return {
                        status: false,
                        hex: 'click必须是一组xy对象的数组例如:[{x:1,y:2},{x:3,y:4},...]'
                    }
                } else {
                    const { start } = code.value as { start: xyTemlate }
                    const offsetValue = finalConfigurationFile.rangeValue
                    const val = value as xyTemlate[]
                    val.forEach(item => {
                        if (item.x + offsetValue > start.x && start.x < item.x - offsetValue && item.y + offsetValue > start.y && start.y < item.y - offsetValue) {
                            return {
                                status: false,
                                hex
                            }
                        }
                    })
                    return {
                        status: true,
                        hex
                    }
                }
            default:
                break;
        }
    }
}
