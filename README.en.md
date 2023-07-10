**A simple captcha generator**

Dependencies: node version `^16.14.2`, canvas: `^2.11.2`

Installation

```shell
npm i eazyCaptcha
```
Usage

```javascript
import eazyCaptcha from 'eazyCaptcha';
```
```javascript
// You can call the function without any parameters to generate a set of text captcha
eazyCaptcha().then((res: any) => {
    console.log(res.verificationCodeHex, 'res');
}).catch((err)=>{
    console.log(err,'err');
})
```
If you need a different type of captcha, you can modify the parameters based on the default template below:

```typescript
{ 
    codeType: <codeType>'character', // Type of captcha: text (default) 'character', calculation 'calculate', dragging 'slide', clicking 'click'
    characterString: <string>'', // Captcha string or character array. If not provided, a random set will be generated. Can be Chinese, English, numbers, or special characters. For the 'click' type, it is the text displayed above.
    codeSize: <number>'300*150', // Captcha size. Supports formats '200*100' and '200x100'
    characterLength: <number>4, // Length of characters (except for 'slide')
    rotationAngle: <number>0, // Rotation angle. Default is '0'. Can be selected between '1' and '-1'. Recommended not to exceed this range. Only valid for 'character' and 'calculate'.
    disturbingLinesNumber: <number>3, // Number of disturbing lines. Only valid for 'character' and 'calculate'.
    codeBackImage: <string>'#fff', // Background image or color of the captcha. Supports all standard color values. If it's a 'slide' or 'click' captcha, an **image URL** must be provided.
    saveOrNot: <boolean>true, // Whether to save the rendered captcha locally. It will be saved in the 'verificationCode' folder.
    colorGroup: <string[]|string>['#dc3545', '#0dcaf0', '#ffc107', '#198', '#0d6efd'] // Text color group. Can be an array or a single color value. Supports all standard color values.
}
```
Output structure of the 'res' object:

```typescript
{
    // Captcha content. If it's not a dragging captcha, it's the base64 content of the captcha. Otherwise, it's an object.
    verificationCode: string | {
        // Base64 content of the background layer
        break: string,
        // Content of the dragging layer
        front: string,
        // Difference in height between the top left corner of the dragging layer and the top left corner of the background layer
        startHeight: number,
    },
    // Captcha size
    codeSize: string,
    // Unique hash value of the captcha (used to check if it passes the verification)
    verificationCodeHex: string,
    // Whether the captcha is successfully generated
    status: boolean,
    // Type of captcha
    codeType: CodeType
}
```
**Note**

If you encounter an error while installing canvas:

```shell
npm ERR! path /home/des/Desktop/verificationCode/node_modules/canvas
npm ERR! command failed
npm ERR! signal SIGINT
npm ERR! command sh -c node-pre-gyp install --fallback-to-build --update-binary
```
You can try the following command:

```shell
npm install canvas --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas
```