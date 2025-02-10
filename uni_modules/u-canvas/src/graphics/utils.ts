// import { v4 as uuid } from "uuid";
import { Point, Line } from "../offset";
import type { Style, CanvasFontWeight } from "./styles";
import { StrokeCap, StrokeJoin } from "./styles";

export function generateUUID(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function extractStyle(options: CanvasRenderingContext2D): Style {
	const [fontSize, fontFamily, fontWeight] = options.font.split(" ");

	return {
		stroke: {
			color: options.strokeStyle as string,
			width: options.lineWidth,
			cap: options.lineCap as StrokeCap,
			join: options.lineJoin as StrokeJoin,
		},
		fill: { color: options.fillStyle as string },
		text: {
			fontSize: parseFloat(fontSize),
			fontFamily: fontFamily,
			fontWeight: fontWeight as CanvasFontWeight,
			direction: options.direction,
			letterSpacing: parseFloat(options.letterSpacing),
			wordSpacing: parseFloat(options.wordSpacing),
			textAlign: options.textAlign,
			textBaseline: options.textBaseline,
			textRendering: options.textRendering,
		},
	};
}

// 投影法
export function isPointOnLineSegment(point: Point, line: Line, tolerance: number = 0): boolean {
	const dx = line.end.x - line.start.x;
	const dy = line.end.y - line.start.y;

	const lengthSquared = dx * dx + dy * dy;
	const t = ((point.x - line.start.x) * dx + (point.y - line.start.y) * dy) / lengthSquared;

	if (t < 0) {
		return Math.hypot(point.x - line.start.x, point.y - line.start.y) <= tolerance;
	} else if (t > 1) {
		return Math.hypot(point.x - line.end.x, point.y - line.end.y) <= tolerance;
	}

	const projectionX = line.start.x + t * dx;
	const projectionY = line.start.y + t * dy;

	return Math.hypot(point.x - projectionX, point.y - projectionY) <= tolerance;
}

export function repeatArray(array: Uint8ClampedArray, count: number): Uint8ClampedArray {
	const length = array.length; // 获取原数组长度
	const result = new Uint8ClampedArray(length * count); // 创建结果数组

	// 将原数组和目标数组转换为 Uint32Array 以提高复制效率
	const srcData = new Uint32Array(array.buffer);
	const dstData = new Uint32Array(result.buffer);

	// 计算需要复制的 32 位元素数量
	const uint32Count = length / 4;

	// 批量复制数据
	for (let i = 0; i < count; i++) {
		const offset = i * uint32Count; // 计算目标数组的偏移量
		dstData.set(srcData, offset); // 复制数据
	}

	return result;
}

export function scaleImageData(imageData: ImageData, xs: number, ys: number): ImageData {
	const { width, height, data } = imageData;

	// 检查缩放因子是否合法
	if (xs <= 0 || ys <= 0) {
		throw new Error("Scale factors must be greater than 0");
	}

	// 计算新尺寸
	const newWidth = Math.round(width * xs);
	const newHeight = Math.round(height * ys);

	// 如果新尺寸无效，返回原数据
	if (newWidth <= 0 || newHeight <= 0) {
		return imageData;
	}

	// 创建新的 Uint8ClampedArray 存储缩放后的数据
	const scaledData = new Uint8ClampedArray(newWidth * newHeight * 4);

	// 将原数据转换为 Uint32Array 以提高复制效率
	const srcData = new Uint32Array(data.buffer);
	const dstData = new Uint32Array(scaledData.buffer);

	// 遍历新图像的每个像素
	for (let y = 0; y < newHeight; y++) {
		const originalY = Math.floor(y / ys); // 计算原图像中的 Y 坐标
		const srcRowStart = originalY * width; // 原图像中当前行的起始索引

		for (let x = 0; x < newWidth; x++) {
			const originalX = Math.floor(x / xs); // 计算原图像中的 X 坐标
			const srcIndex = srcRowStart + originalX; // 原图像中的像素索引
			const dstIndex = y * newWidth + x; // 新图像中的像素索引

			// 复制像素数据（32 位复制，一次复制 4 个字节）
			dstData[dstIndex] = srcData[srcIndex];
		}
	}

	// 返回缩放后的 ImageData
	return {
		colorSpace: imageData.colorSpace,
		data: scaledData,
		width: newWidth,
		height: newHeight,
	} as ImageData;
}
