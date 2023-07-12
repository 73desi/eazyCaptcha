**一个简简单单的验证码生成器**

依赖:node版本`^16.14.2`、canvas: `^2.11.2`

安装

```shell
npm i eazyCaptcha
```

使用

```javascript
import eazyCaptcha,{validate} from 'eazyCaptcha';
```

如需自定义配置,按照以下内容修改
```typescript
const config = { 
    codeType: <codeType>'character',//验证码类型，文字(默认)`character` 、计算 `calculate` 、拖动 `slide` 、点击 `click`
    characterString: <string>'',//验证码字符串、字符数组,不传入则随机生成一组,可以为中文、英文、数字、特殊符号，如果是`click`类型则为上方的字
    codeSize: <string>'300*150', //验证码尺寸支持`200*100`和`200x100`俩种格式
    matchCase:<boolean>true,//`character`是否区分大小写
    rangeValue:<number>20,//`slide`、`click`容错值
    characterLength: <number>4,//字符长度,除`slide`以外都生效
    rotationAngle: <number>0, //旋转角度,默认`0`,可以在`1`~`-1`之间选择，不推荐超过这个值,只在`character`和`calculate`生效
    disturbingLinesNumber: <number>3,//扰乱线条数,只在`character`和`calculate`生效
    codeBackImage: <string>'#fff', //验证码的背景图片或者颜色,支持所有标准的颜色值，如果是`slide`、`click`验证码必须传入**图片url**
    saveOrNot: <boolean>true,//是否将渲染的验证码报错到本地，会保存到`verificationCode`文件夹里面
    colorGroup: <string[]|string>['#dc3545', '#0dcaf0', '#ffc107', '#198', '#0d6efd']// 文字颜色组,可以为数组或者单个颜色值支持所有标准的颜色值
    }
```
创建验证码
```javascript
//可以不携带任何参数，将会送出一组文字验证码
eazyCaptcha(config).then((res: any) => {
    console.log(res.verificationCodeHex, 'res');
}).catch((err)=>{
    console.log(err,'err');
})
```

res输出内容结构
```typescript
{
    //验证码内容，如果不是拖动验证码则为base64的验证码内容，否则为对象
    verificationCode:string|{
        // 背景层base64内容
        break: string,
        // 拖动层内容
        front: string,
        // 拖动层左上角距离背景层左上角高度的差值
        startHeight: number,
    },
    // 验证码大小
    codeSize: string,
    // 验证码唯一哈希值(用于检测是否通过检测)
    verificationCodeHex:string,
    //验证码是否建立成功
    status:boolean,
    // 验证码的类型
    codeType:CodeType
}
```
进行验证
```javascript
//需要传入验证码的唯一hex值，验证内容
 validate(result.verificationCodeHex, value).then(val => {
            console.log(val);
        }).catch(err => {
            console.log(err);
        })
```
验证的返回值
```typescript
{
    status:boolean,//验证是否成功
    hex:string//唯一哈希值
}
```
**注意**

如果安装canvas报错
```shell
npm ERR! path /home/des/Desktop/verificationCode/node_modules/canvas
npm ERR! command failed
npm ERR! signal SIGINT
npm ERR! command sh -c node-pre-gyp install --fallback-to-build --update-binary
```
可以尝试

```shell
npm install canvas --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas
```

