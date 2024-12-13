import { Style } from "./graphics";

export class Paint {
	/**
	 * 绘制一段弧线
	 * @param x 圆弧中心（圆心）的 x 轴坐标
	 * @param y 圆弧中心（圆心）的 y 轴坐标
	 * @param radius 圆弧的半径
	 * @param startAngle 圆弧的起始点，x 轴方向开始计算，单位为弧度
	 * @param endAngle 圆弧的终点，单位为弧度
	 * @param anticlockwise 圆弧绘制方向，true：逆时针绘制，false：顺时针绘制。默认为 true
	 */
	arc(
		//
		x: number,
		y: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		anticlockwise: boolean = true
	): void {}

	/**
	 * 根据控制点和半径绘制圆弧路径，使用当前的描点 (前一个 moveTo 或 lineTo 等函数的止点)。
	 *
	 * 根据当前描点与给定的控制点 1 连接的直线，和控制点 1 与控制点 2 连接的直线，作为使用指定半径的圆的切线，画出两条切线之间的弧线路径
	 * @param x1 第一个控制点的 x 轴坐标
	 * @param y1 第一个控制点的 y 轴坐标
	 * @param x2 第二个控制点的 x 轴坐标
	 * @param y2 第二个控制点的 y 轴坐标
	 * @param radius 圆弧的半径
	 */
	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {}

	/**
	 * 开始创建一个路径。需要调用 fill 或者 stroke 才会使用路径进行填充或描边
	 */
	// beginPath(): void {}

	/**
	 * 绘制三次贝赛尔曲线路径
	 * @param cp1x 第一个控制点的 x 轴坐标
	 * @param cp1y 第一个控制点的 y 轴坐标
	 * @param cp2x 第二个控制点的 x 轴坐标
	 * @param cp2y 第二个控制点的 y 轴坐标
	 * @param x 结束点的 x 轴坐标
	 * @param y 结束点的 y 轴坐标
	 */
	bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {}

	/**
	 * 清除画布上在该矩形区域内的内容
	 * @param x 矩形起点的 x 轴坐标
	 * @param y 矩形起点的 y 轴坐标
	 * @param width 矩形的宽度
	 * @param height 矩形的高度
	 */
	clearRect(x: number, y: number, width: number, height: number): void {}

	/**
	 * 将当前创建的路径设置为当前剪切路径
	 */
	// clip(): void;
	/**
	 * 将当前创建的路径设置为当前剪切路径
	 * @param path Path2D用来声明路径，用来在canvas中根据需要创建可以保留并重用的路径, 此路径会被CanvasRenderingContext2D对象使用
	 */
	// clip(path: Path2D): void;
	/**
	 * 将当前创建的路径设置为当前剪切路径
	 * @param fillRule 规则
	 */
	// clip(fillRule: string): void;
	/**
	 * 将当前创建的路径设置为当前剪切路径
	 * @param path Path2D用来声明路径，用来在canvas中根据需要创建可以保留并重用的路径, 此路径会被CanvasRenderingContext2D对象使用
	 * @param fillRule 规则
	 */
	// clip(path: Path2D, fillRule: string): void;
	// clip(path?: Path2D | string, fillRule?: string): void {}

	/**
	 * 关闭一个路径
	 */
	// closePath(): void {}

	/**
	 * 创建一个新的、空白的、指定大小的 ImageData 对象。所有的像素在新对象中都是透明的黑色
	 * @param width
	 * @param height
	 */
	// createImageData(width: number, height: number): ImageData {}

	/**
	 * 对指定的图像创建模式的方法，可在指定的方向上重复元图像
	 * @param image 重复的图像源，支持代码包路径和本地临时路径 (本地路径)
	 * @param repetition 如何重复图像
	 * @returns 一个不透明对象，描述了一个基于图像、画布或视频的模板，该模板通过 CanvasRenderingContext2D.createPattern() 方法创建
	 */
	// createPattern(image: { src: string }, repetition: string): CanvasPattern {}

	/**
	 * 创建一个线性的渐变颜色。
	 *
	 * 返回的 CanvasGradient对象需要使用 CanvasGradient.addColorStop() 来指定渐变点，至少要两个
	 * @param x0 起点的 x 坐标
	 * @param y0 起点的 y 坐标
	 * @param x1 终点的 x 坐标
	 * @param y1 终点的 y 坐标
	 * @returns 描述渐变的不透明对象。
	 *
	 * 该接口通过 CanvasRenderingContext2D.createLinearGradient()、
	 * 					CanvasRenderingContext2D.createConicGradient() 或
	 * 					CanvasRenderingContext2D.createRadialGradient()
	 * 方法返回
	 */
	// createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {}

	/**
	 * 根据参数确定两个圆的坐标，绘制放射性渐变。
	 *
	 * 注意App平台和Web平台绘制效果有差异
	 * @param x0 开始圆形的 x 轴坐标
	 * @param y0 开始圆形的 y 轴坐标
	 * @param r0 开始圆形的半径
	 * @param x1 结束圆形的 x 轴坐标
	 * @param y1 结束圆形的 y 轴坐标
	 * @param r01 结束圆形的半径
	 * @returns 描述渐变的不透明对象。
	 */
	// createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r01: number): CanvasGradient {}
	/**
	 * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
	 *
	 * 该操作为可选非web标准，canvas组件会自动选择合适时机进行绘制
	 */
	// draw(): void {}

	/**
	 * 绘制图像到画布
	 * @param image 所要绘制的图片资源
	 * @param sx 需要绘制到画布中的，image的矩形（裁剪）选择框的左上角 x 坐标
	 * @param sy 需要绘制到画布中的，image的矩形（裁剪）选择框的左上角 y 坐标
	 */
	drawImage(image: { src: string }, sx: number, sy: number): void;
	/**
	 * 绘制图像到画布
	 * @param image 所要绘制的图片资源
	 * @param sx 需要绘制到画布中的，image的矩形（裁剪）选择框的左上角 x 坐标
	 * @param sy 需要绘制到画布中的，image的矩形（裁剪）选择框的左上角 y 坐标
	 * @param sWidth 宽度
	 * @param sHeight 高度
	 */
	drawImage(image: { src: string }, sx: number, sy: number, sWidth: number, sHeight: number): void;
	/**
	 * 绘制图像到画布
	 * @param image 所要绘制的图片资源
	 * @param sx 需要绘制到画布中的，image的矩形（裁剪）选择框的左上角 x 坐标
	 * @param sy 需要绘制到画布中的，image的矩形（裁剪）选择框的左上角 y 坐标
	 * @param sw 宽度
	 * @param sh 高度
	 * @param dx 偏移量 x
	 * @param dy 偏移量 y
	 * @param dw 偏移量 w
	 * @param dh 偏移量 h
	 */
	drawImage(
		image: { src: string },
		sx: number,
		sy: number,
		sw: number,
		sh: number,
		dx: number,
		dy: number,
		dw: number,
		dh: number
	): void {}

	/**
	 * 添加椭圆路径。
	 *
	 * 椭圆的圆心在（x,y）位置，半径分别是radiusX 和 radiusY，按照anticlockwise（默认顺时针）指定的方向，从 startAngle 开始绘制，到 endAngle 结束
	 * @param x 椭圆圆心的 x 轴（水平）坐标
	 * @param y 椭圆圆心的 y 轴（垂直）坐标
	 * @param radiusX 椭圆长轴的半径。必须为非负数
	 * @param radiusY 椭圆短轴的半径。必须为非负数。
	 * @param rotation 椭圆的旋转角度，以弧度表示。
	 * @param startAngle 椭圆弧的起始偏心角，从正 x 轴沿顺时针测量，用弧度表示。
	 * @param endAngle 椭圆弧的结束偏心角，从正 x 轴沿顺时针测量，用弧度表示。
	 * @param anticlockwise 一个可选的布尔值，如果为 true，则逆时针绘制椭圆弧。默认值为 false（顺时针）。
	 */
	ellipse(
		x: number,
		y: number,
		radiusX: number,
		radiusY: number,
		rotation: number,
		startAngle: number,
		endAngle: number,
		anticlockwise: boolean
	): void {
		// * @param anticlockwise 圆弧绘制方向，true：逆时针绘制，false：顺时针绘制。默认为 true
	}

	/**
	 * 对当前路径中的内容进行填充
	 */
	fill(): void;
	/**
	 * 对当前路径中的内容进行填充
	 * @param fillRule 填充当前或已存在的路径的方法。采取非零环绕(nonzero)或者奇偶环绕(evenodd)规则
	 */
	fill(fillRule: "nonzero" | "evenodd"): void;
	/**
	 * 对指定路径中的内容进行填充
	 * @param path 填充路径
	 */
	fill(path: Path2D): void;
	/**
	 * 对指定路径中的内容进行填充
	 * @param path 填充路径
	 * @param fillRule 填充当前或已存在的路径的方法。采取非零环绕(nonzero)或者奇偶环绕(evenodd)规则
	 */
	fill(path: Path2D, fillRule: "nonzero" | "evenodd"): void;
	fill(path?: Path2D | "nonzero" | "evenodd", fillRule?: "nonzero" | "evenodd"): void {}

	/**
	 * 填充一个矩形。
	 *
	 * 用 setFillStyle 设置矩形的填充色，如果没设置默认是黑色
	 * @param x 矩形起点的 x 轴坐标
	 * @param y 矩形起点的 y 轴坐标
	 * @param width 矩形的宽度
	 * @param height 矩形的高度
	 */
	// fillRect(x: number, y: number, width: number, height: number): void {}

	/**
	 * 在画布上绘制文本
	 * @param text 要渲染的文本字符串
	 * @param x 开始绘制文本的点的 X 轴坐标
	 * @param y 开始绘制文本的点的 X 轴坐标
	 * @param maxWidth 需要绘制的最大宽度
	 */
	fillText(text: string, x: number, y: number, maxWidth?: number): void {}

	/**
	 * 获取指定区域的 ImageData对象
	 * @param sx 将要被提取的图像数据矩形区域的左上角 x 坐标
	 * @param sy 将要被提取的图像数据矩形区域的左上角 y 坐标
	 * @param sw 将要被提取的图像数据矩形区域的宽度
	 * @param sh 将要被提取的图像数据矩形区域的高度
	 */
	// getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {}

	/**
	 * 返回一个 Boolean 标记上下文是否已经丢失
	 */
	// isContextLost(): boolean {}

	/**
	 * 判断在当前路径中是否包含检测点
	 * @param x 检测点的 X 坐标
	 * @param y 检测点的 Y 坐标
	 */
	// isPointInPath(x: number, y: number): boolean;

	/**
	 * 判断在当前路径中是否包含检测点
	 * @param x 检测点的 X 坐标
	 * @param y 检测点的 Y 坐标
	 * @param fillRule 用来决定点在路径内还是在路径外的算法
	 */
	// isPointInPath(x: number, y: number, fillRule: string): boolean;

	/**
	 * 判断在当前路径中是否包含检测点
	 * @param path Path2D应用的路径
	 * @param x 检测点的 X 坐标
	 * @param y 检测点的 Y 坐标
	 */
	// isPointInPath(path: Path2D, x: number, y: number): boolean;
	/**
	 * 判断在当前路径中是否包含检测点
	 * @param path Path2D应用的路径
	 * @param x 检测点的 X 坐标
	 * @param y 检测点的 Y 坐标
	 * @param fillRule 用来决定点在路径内还是在路径外的算法
	 */
	// isPointInPath(path: Path2D, x: number, y: number, fillRule: string): boolean;
	// isPointInPath(pathOrX: Path2D | number, xOrY: number, yOrFillRule?: string | number, fillRule?: string): boolean {}

	/**
	 * 检测某点是否在路径的描边线
	 * @param x 检测点的 X 坐标
	 * @param y 检测点的 Y 坐标
	 */
	// isPointInStroke(x: number, y: number): boolean {}

	/**
	 * 在填充线时使用虚线模式, 它使用一组值来指定描述模式的线和间隙的交替长度。注意App平台和Web平台绘制效果有差异
	 */
	// getLineDash(): number[] {}

	/**
	 * 增加一个新点，然后创建一条从上次指定点到目标点的线。
	 *
	 * 用 stroke 方法来画线条
	 * @param x
	 * @param y
	 */
	lineTo(x: number, y: number): void {}

	/**
	 * 测量文本尺寸信息。目前仅返回文本宽度
	 * @param text 要渲测量的文本字符串
	 * @returns 表示文本的尺寸，通过 CanvasRenderingContext2D.measureText() 方法创建
	 */
	// measureText(text: string): TextMetrics {}

	/**
	 * 把路径移动到画布中的指定点
	 * @param x 目标位置的 x 坐标
	 * @param y 目标位置的 y 坐标
	 */
	moveTo(x: number, y: number): void {}

	/**
	 * 将数据从已有的 ImageData 对象绘制到位图的方法。
	 *
	 * 如果提供了一个绘制过的矩形，则只绘制该矩形的像素。此方法不受画布转换矩阵的影响
	 * @param imageData 包含像素值的数组对象
	 * @param x 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）
	 * @param y 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）
	 */
	putImageData(imageData: ImageData, x: number, y: number): boolean;

	/**
	 * 将数据从已有的 ImageData 对象绘制到位图的方法。
	 *
	 * 如果提供了一个绘制过的矩形，则只绘制该矩形的像素。此方法不受画布转换矩阵的影响
	 * @param imageData 包含像素值的数组对象
	 * @param x 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）
	 * @param y 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）
	 * @param dx 在源图像数据中，矩形区域左上角的位置。默认是整个图像数据的左上角（x 坐标）
	 * @param dy 在源图像数据中，矩形区域左上角的位置。默认是整个图像数据的左上角（y 坐标）
	 * @param dw 在源图像数据中，矩形区域的宽度。默认是图像数据的宽度
	 * @param dh 在源图像数据中，矩形区域的高度。默认是图像数据的高度
	 */
	putImageData(imageData: ImageData, x: number, y: number, dx: number, dy: number, dw: number, dh: number): boolean;
	putImageData(
		imageData: ImageData,
		x: number,
		y: number,
		dx?: number,
		dy?: number,
		dw?: number,
		dh?: number
	): boolean {}

	/**
	 * 创建二次贝塞尔曲线路径
	 * @param cpx 贝塞尔控制点的 x 坐标
	 * @param cpy 贝塞尔控制点的 y 坐标
	 * @param x 结束点的 x 坐标
	 * @param y 结束点的 y 坐标
	 */
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {}

	/**
	 * 创建一个矩形路径
	 * @param x 矩形路径起点的 x 轴坐标
	 * @param y 矩形路径起点的 y 轴坐标
	 * @param width 矩形路径的宽度
	 * @param height 矩形路径的高度
	 */
	rect(x: number, y: number, width: number, height: number, radii: number, style: Style): void {
		(ctx: CanvasRenderingContext2D) => {
			if (radii) {
				ctx.roundRect(x, y, width, height, radii);
			} else {
				ctx.rect(x, y, width, height);
			}

			ctx.stroke();
			ctx.fill();
		};
	}

	/**
	 * 使用单位矩阵重新设置当前变换
	 */
	// resetTransform(): void {}

	/**
	 * 恢复之前保存的绘图上下文
	 */
	// restore(): void {}

	/**
	 * 以原点为中心顺时针旋转当前坐标轴
	 * @param rotate 以弧度计 degrees * Math.PI/180；degrees 范围为 0-360
	 */
	// rotate(rotate: number): void {}

	/**
	 * 在当前路径中添加一个圆角矩形
	 * @param x 矩形起点的 x 轴坐标，以像素为单位
	 * @param y 矩形起点的 y 轴坐标，以像素为单位
	 * @param width 矩形的宽度。正值向右，负值向左
	 * @param height 矩形的高度。正值向下，负值向上
	 * @param radii ?
	 */
	// roundRect(x: number, y: number, width: number, height: number, radii: any): boolean {}

	/**
	 * 保存绘图上下文
	 */
	// save(): void {}

	/**
	 * 缩放变换
	 * @param x x轴
	 * @param y y轴
	 */
	// scale(x: number, y: number): void {}

	/**
	 * 在填充线时使用虚线模式, 它使用一组值来指定描述模式的线和间隙的交替长度
	 * @param segments 描述交替绘制线段和间距（坐标空间单位）长度的数字
	 */
	setLineDash(segments: number[]): void {}

	/**
	 * 使用单位矩阵重新设置（覆盖）当前的变换并调用变换
	 * @param scaleX 水平缩放
	 * @param skewY 垂直倾斜
	 * @param skewX 水平倾斜
	 * @param scaleY 垂直缩放
	 * @param translateX 水平移动
	 * @param translateY 垂直移动
	 */
	// setTransform(
	// 	scaleX: number,
	// 	skewY: number,
	// 	skewX: number,
	// 	scaleY: number,
	// 	translateX: number,
	// 	translateY: number
	// ): void {}

	/**
	 * 画出当前路径的边框。默认颜色色为黑色
	 */
	stroke(): void;
	/**
	 * 画出指定路径的边框。默认颜色色为黑色
	 * @param path Path2D应用的路径
	 */
	stroke(path: Path2D): void;
	stroke(path?: Path2D): void {}

	/**
	 * 画一个矩形(非填充)
	 * @param x 矩形起点的 x 轴坐标
	 * @param y 矩形起点的 y 轴坐标
	 * @param width 矩形的宽度
	 * @param height 矩形的高度
	 */
	// strokeRect(x: number, y: number, width: number, height: number): void {}

	/**
	 * 文本描边
	 * @param text 要渲染的文本字符串
	 * @param x 开始绘制文本的点的 X 轴坐标
	 * @param y 开始绘制文本的点的 Y 轴坐标
	 * @param maxWidth 需要绘制的最大宽度
	 */
	strokeText(text: string, x: number, y: number, maxWidth?: number): void {}

	/**
	 * 使用矩阵多次叠加当前变换，矩阵由方法的参数进行描述。
	 *
	 * 可以缩放、旋转、移动和倾斜上下文
	 * @param scaleX 水平缩放
	 * @param skewY 垂直倾斜
	 * @param skewX 水平倾斜
	 * @param scaleY 垂直缩放
	 * @param translateX 水平移动
	 * @param translateY 垂直移动
	 */
	// transform(
	// 	scaleX: number,
	// 	skewY: number,
	// 	skewX: number,
	// 	scaleY: number,
	// 	translateX: number,
	// 	translateY: number
	// ): void {}

	/**
	 * 当前网格添加平移变换
	 * @param tx 水平方向的移动距离
	 * @param ty 垂直方向的移动距离
	 */
	// translate(tx: number, ty: number): void {}

	// 使用自定义字体
	// 在 canvas 中调用 CanvasRenderingContext2D.filltext、CanvasRenderingContext2D.stroketext 绘制文字时，可通过 font 属性指定绘制文字所使用的字体样式，其中字体名称（fontfamily）可设置自定义字体。
	// 当使用自定义字体时，需先通过 uni.loadFontFace 加载字体，字体加载成功之后在设置 font 属性指定字体名称。

	/**
	 * 闭合路径，将最后一个点与起点连接起来。
	 *
	 * 如果图形已经封闭，或者只有一个点，那么此方法不会产生任何效果。
	 */
	closePath(): void {}

	/**
	 * 将一个新的路径的起始点移动到 (x，y) 坐标
	 * @param x 点的X轴坐标
	 * @param y 点的Y轴坐标
	 */
	moveTo(x: number, y: number): void {}

	/**
	 * 将路径的最后一个点连接到 (x，y) 坐标
	 * @param x 线终点的X轴坐标
	 * @param y 线终点的Y轴坐标
	 */
	lineTo(x: number, y: number): void;

	/**
	 * 创建三次方贝塞尔曲线路径
	 * @param cp1x 第一个贝塞尔控制点的 x 坐标
	 * @param cp1y 第一个贝塞尔控制点的 y 坐标
	 * @param cp2x 第二个贝塞尔控制点的 x 坐标
	 * @param cp2y 第二个贝塞尔控制点的 x 坐标
	 * @param x 结束点的 x 坐标
	 * @param y 结束点的 y 坐标
	 */
	bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {}

	/**
	 * 创建二次贝塞尔曲线路径
	 * @param cpx 贝塞尔控制点的 x 坐标
	 * @param cpy 贝塞尔控制点的 y 坐标
	 * @param x 结束点的 x 坐标
	 * @param y 结束点的 y 坐标
	 */
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;

	/**
	 * 绘制一段弧线
	 * @param x 圆弧中心（圆心）的 x 轴坐标
	 * @param y 圆弧中心（圆心）的 y 轴坐标
	 * @param radius 圆弧的半径
	 * @param startAngle 圆弧的起始点，x 轴方向开始计算，单位为弧度
	 * @param endAngle 圆弧的终点，单位为弧度
	 * @param anticlockwise 圆弧绘制方向，true：逆时针绘制，false：顺时针绘制。默认为 true
	 */
	arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): void {}

	/**
	 * 根据控制点和半径绘制圆弧路径，使用当前的描点 (前一个 moveTo 或 lineTo 等函数的止点)。
	 *
	 * 根据当前描点与给定的控制点 1 连接的直线，和控制点 1 与控制点 2 连接的直线，作为使用指定半径的圆的切线，画出两条切线之间的弧线路径
	 * @param x1 第一个控制点的 x 轴坐标
	 * @param y1 第一个控制点的 y 轴坐标
	 * @param x2 第二个控制点的 x 轴坐标
	 * @param y2 第二个控制点的 y 轴坐标
	 * @param radius 圆弧的半径
	 */
	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;

	/**
	 * 添加椭圆路径。
	 *
	 * 椭圆的圆心在（x,y）位置，半径分别是radiusX 和 radiusY，按照anticlockwise（默认顺时针）指定的方向，从 startAngle 开始绘制，到 endAngle 结束
	 * @param x 椭圆圆心的 x 轴（水平）坐标
	 * @param y 椭圆圆心的 y 轴（垂直）坐标
	 * @param radiusX 椭圆长轴的半径。必须为非负数
	 * @param radiusY 椭圆短轴的半径。必须为非负数。
	 * @param rotation 椭圆的旋转角度，以弧度表示。
	 * @param startAngle 椭圆弧的起始偏心角，从正 x 轴沿顺时针测量，用弧度表示。
	 * @param endAngle 椭圆弧的结束偏心角，从正 x 轴沿顺时针测量，用弧度表示。
	 * @param anticlockwise 一个可选的布尔值，如果为 true，则逆时针绘制椭圆弧。默认值为 false（顺时针）。
	 */
	ellipse(
		x: number,
		y: number,
		radiusX: number,
		radiusY: number,
		rotation: number,
		startAngle: number,
		endAngle: number,
		anticlockwise: boolean
	): void {
		// * @param anticlockwise 圆弧绘制方向，true：逆时针绘制，false：顺时针绘制。默认为 true
	}

	/**
	 * 创建一个矩形路径
	 * @param x 矩形路径起点的 x 轴坐标
	 * @param y 矩形路径起点的 y 轴坐标
	 * @param width 矩形路径的宽度
	 * @param height 矩形路径的高度
	 */
	// rect(x: number, y: number, width: number, height: number): void {}

	// 自己添加

	public acts = [];

	public paints: Paint[] = [];
	addPaint(paint: Paint): void {
		this.paints.push(paint);
	}
}
