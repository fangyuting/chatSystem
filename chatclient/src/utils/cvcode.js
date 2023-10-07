// 生成验证码
export function createCanvas(value, dom, imgUrl, loadedCb) {
    const tempArr = value.split(''); // 将传递进来的验证码字符串 value 拆分成一个字符数组 tempArr，每个字符都被单独存储在数组中
    const canvasStr = tempArr.join(' '); // 将字符数组 tempArr 中的字符通过空格连接起来，生成一个新的字符串 canvasStr，这个字符串将用于在验证码图片上显示。
    const canvas = dom; // 将传递进来的 DOM 元素 dom 存储在 canvas 变量中
    const ctx = canvas.getContext('2d'); // 获取了 <canvas> 元素的 2D 渲染上下文，它将用于在画布上进行绘制操作
    const x = canvas.width / 2; // 计算出画布的中心点横坐标 x，后续将在该位置绘制验证码文字

    const oImg = new Image(); // 创建一个新的 Image 对象 oImg，它将用于加载验证码背景图片
    oImg.src = imgUrl; // 设置 oImg 的 src 属性为传递进来的图片 URL imgUrl，以开始加载图片
    oImg.width = 120;
    oImg.height = 40;

    // 当图片加载完成时，执行这个回调函数。在这里，将执行生成验证码图片的操作
    oImg.onload = function () {
        // 首先，它检查 loadedCb 是否存在（非空）并且确保它是一个函数
        // 如果 loadedCb 存在且是一个函数，那么 loadedCb() 将被调用，这样就执行了这个回调函数。
        loadedCb && typeof loadedCb === 'function' && loadedCb();
        // 使用加载的图片 oImg 创建一个重复图案 pattern，以备后续填充画布
        const pattern = ctx.createPattern(oImg, 'repeat'); //在指定的方向内重复指定的元素
        ctx.fillStyle = pattern; //填充绘画的颜色
        // 使用填充样式填充整个画布，覆盖整个画布
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 设置文本的水平对齐方式为居中，这意味着绘制的文本将在 x 坐标处居中显示
        ctx.textAlign = 'center';
        // 设置文本颜色
        ctx.fillStyle = '	#DC143C';
        //  设置文本的字体和大小
        ctx.font = '26px Roboto Slab';
        // 设置一个变换矩阵，这会使文本稍微倾斜，以增加验证码的难度
        ctx.setTransform(1, -0.12, 0.2, 1, 0, 0);
        // 使用上述设置，在画布上绘制验证码文本 canvasStr，位置为水平居中 (x) 和垂直位置为 40 像素
        ctx.fillText(canvasStr, x, 40);
    };
}
