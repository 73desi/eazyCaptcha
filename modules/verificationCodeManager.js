"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var verificationCodeStorage = [];
var timer = undefined;
/**
 * 管理验证码
 * @param hex hex值
 * @param value 验证码验证内容
 * @param type 验证码类型
 * @param handle 需要进行的操作
 */
exports.default = (function (hex, handle, type, value, finalConfigurationFile) {
    if (handle === 'set') {
        if (value) {
            var endTimer = Date.now() + (10 * 60 * 1000);
            verificationCodeStorage.push({ key: hex, value: value, type: type, endTimer: endTimer });
        }
        else {
            return console.log('需要设置项value');
        }
        verificationCodeTimer();
    }
    else {
        var code = verificationCodeStorage.find(function (item) { return item.key === hex; });
        if (code) {
            switch (code.type) {
                case 'character':
                    if (finalConfigurationFile && !finalConfigurationFile.matchCase) {
                        value = value.toString().toLowerCase();
                        code.value = code.value.toString().toLowerCase();
                    }
                    if (value == code.value) {
                        clearItem(code.key);
                        return {
                            status: true,
                            hex: hex
                        };
                    }
                    else {
                        return {
                            status: false,
                            hex: hex
                        };
                    }
                case "calculate":
                    if (value == code.value) {
                        clearItem(code.key);
                        return {
                            status: true,
                            hex: hex
                        };
                    }
                    else {
                        return {
                            status: false,
                            hex: hex
                        };
                    }
                case "slide":
                    if (typeof value !== 'object') {
                        return {
                            status: false,
                            hex: '注意，slide类型验证码需要是一个包含左上角xy值的二维坐标对象,例如{x:1,y:2}'
                        };
                    }
                    else {
                        var _a = value, x = _a.x, y = _a.y;
                        var start = code.value.start;
                        var offsetValue = finalConfigurationFile.rangeValue;
                        if (x + offsetValue > start.x && start.x < x - offsetValue && y + offsetValue > start.y && start.y < y - offsetValue) {
                            clearItem(code.key);
                            return {
                                status: false,
                                hex: hex
                            };
                        }
                        else {
                            return {
                                status: true,
                                hex: hex
                            };
                        }
                    }
                case "click":
                    if (Array.isArray(value)) {
                        return {
                            status: false,
                            hex: 'click必须是一组xy对象的数组例如:[{x:1,y:2},{x:3,y:4},...]'
                        };
                    }
                    else {
                        var start_1 = code.value.start;
                        var offsetValue_1 = finalConfigurationFile.rangeValue;
                        var val = value;
                        val.forEach(function (item) {
                            if (item.x + offsetValue_1 > start_1.x && start_1.x < item.x - offsetValue_1 && item.y + offsetValue_1 > start_1.y && start_1.y < item.y - offsetValue_1) {
                                return {
                                    status: false,
                                    hex: hex
                                };
                            }
                        });
                        return {
                            status: true,
                            hex: hex
                        };
                    }
                default:
                    break;
            }
        }
        else {
            return {
                status: false,
                hex: '不存在该验证码'
            };
        }
    }
});
// 定时器
function verificationCodeTimer() {
    if (timer) {
        clearInterval(timer);
    }
    else {
        timer = setInterval(function () {
            if (verificationCodeStorage.length > 0) {
                var now_1 = Date.now();
                verificationCodeStorage = verificationCodeStorage.filter(function (item) { return item.endTimer > now_1; });
            }
        }, 1000);
    }
}
// 清除指定id的项
function clearItem(hex) {
    verificationCodeStorage = verificationCodeStorage.filter(function (item) { return item.key !== hex; });
    verificationCodeTimer();
}
