import code, { codeConfig, CodeType, codeResult, validate } from './index';
import { createInterface } from "readline";
// 普通验证码
code().then((res: unknown) => {
    const result = res as codeResult;
    save(result.verificationCode as string, result.codeType as string)
    // 定义控制台输入
    const write = createInterface({
        input: process.stdin,
        output: process.stdout
    })
    // 进行检测
    write.on('line', (line: string) => {
        validate(result.verificationCodeHex, line).then(val => {
            console.log(val);
        }).catch(err => {
            console.log(err);
        })
    })
}).catch((err) => {
    console.log(err, 'err');
})
// // 计算验证码
// code({
//     codeType:'calculate'
// }).then((res: unknown) => {
//     const result = res as codeResult;
//     save(result.verificationCode as string, result.codeType as string)
//     // 定义控制台输入
//     const write = createInterface({
//         input: process.stdin,
//         output: process.stdout
//     })
//     // 进行检测
//     write.on('line', (line: string) => {
//         validate(result.verificationCodeHex, line).then(val => {
//             console.log(val);
//         }).catch(err => {
//             console.log(err);
//         })
//     })
// }).catch((err) => {
//     console.log(err, 'err');
// })
// 滚动/拖动验证码
// code({
//     codeType: 'slide',
//     codeBackImage: './assets/1-300x150.jpg'
// })
//     .then((res: unknown) => {
//         const result = res as codeResult;
//         result.verificationCode = result.verificationCode as {
//             break: string,
//             front: string,
//             startHeight: number,
//         }
//         save(result.verificationCode.break, result.codeType as string + 'break')
//         save(result.verificationCode.front, result.codeType as string + 'front')
//         // 定义控制台输入
//         const write = createInterface({
//             input: process.stdin,
//             output: process.stdout
//         })
//         // 定义二维坐标
//         var coordinate = {
//             x: 0,
//             y: 0
//         }
//         console.log('依次输入xy数值')
//         // 进行检测
//         write.on('line', (line: string) => {
//             // 将坐标写入
//             coordinate.x == 0 ? coordinate.x = parseInt(line.split(',')[0]) : coordinate.y = parseInt(line.split(',')[0])
//             if (coordinate.x != 0 && coordinate.y != 0) {
//                 validate(result.verificationCodeHex, coordinate).then(val => {
//                     console.log(val);
//                 }).catch(err => {
//                     console.log(err);
//                 })
//             }
//         })
//     })
//     .catch((err) => {
//         console.log(err, 'err')
//     })
// 点击验证码
// code({
//     codeType: 'click',
//     codeBackImage: './assets/1-300x150.jpg',
// })
//     .then((res: unknown) => {
//         const result = res as codeResult;
//         save(result.verificationCode as string, result.codeType as string)
//     })
//     .catch((err) => {
//         console.log(err, 'err')
//     })
// 保存为图片，测试生成内容是否正确，仅开发使用
function save(verificationCode: string, codeType: string) {
    // 保存为图像文件
    const fs = require('fs');
    const path = require('path');
    const codeName = `${codeType}_${Date.now()}.png`
    const filePath = path.join(__dirname, 'verificationCode')
    fs.stat(filePath, (err: any, stats: any) => {
        if (err) {
            fs.mkdir(filePath, () => { })
        }
        fs.writeFile(path.join(filePath, codeName), Buffer.from(verificationCode.replace(/^data:image\/\w+;base64,/, ''), 'base64'), 'base64', (err: boolean) => {
            if (err) {
                console.error('保存图片失败:', err);
            } else {
                console.log('图片保存成功:', codeName);
            }
        });
    })
}