import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";
/**
 * 扰乱线段生成
 * @param size 验证码尺寸
 * @param baseCode base64编码
 * @returns 处理后的验证码base64编码
 */
export default function (size: { x: number, y: number }, baseCode: string,disturbingLinesNumber:number): Promise<string> {
    const canvas = createCanvas(size.x, size.y);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    const loadImages = async () => {
        const drawingList = getRandomXy(size,disturbingLinesNumber)
        drawingList.forEach(draw => {
            ctx.moveTo(draw.startX, draw.startY);
            ctx.lineTo(draw.endX, draw.endY);
            ctx.strokeStyle = draw.color
            ctx.stroke();
        })
        const codeImage = await loadImage(baseCode);
        ctx.drawImage(codeImage, 0, 0);
        const mergedImageData = canvas.toDataURL(); // 默认格式为 PNG
        // 输出合并后的 Base64 编码图片
        return mergedImageData;
    }
    return loadImages()
}
/**
 * 获取一组随机线段开始解释的xy值
 * @param size 验证码尺寸
 * @returns 返回线段的坐标
 */
function getRandomXy(size: { x: number, y: number },disturbingLinesNumber:number) {
    const lineSegments = disturbingLinesNumber ? disturbingLinesNumber : Math.round((Math.random() * 3) + 2)
    var lineCoordinates = <{
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        color: string
    }[]>[]
    for (let i = 0; i < lineSegments; i++) {
        const startX = Math.round(Math.random() * size.x)
        const startY = Math.round(Math.random() * size.y)
        const endX = Math.round(Math.random() * size.x)
        const endY = Math.round(Math.random() * size.y)
        const randomColor = getRandomColor();
        lineCoordinates.push({
            startX,
            startY,
            endX,
            endY,
            color: randomColor
        })
    }
    return lineCoordinates
}
// 获得一组随机的颜色
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

