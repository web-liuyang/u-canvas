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
	const result = new Uint8ClampedArray(array.length * count);
	for (let i = 0; i < count; i++) {
		result.set(array, i * array.length);
	}
	return result;
}

export function scaleImageData(imageData: ImageData, xs: number, ys: number): ImageData {
	const { width, height, data } = imageData;
	const newWidth = Math.round(width * xs);
	const newHeight = Math.round(height * ys);

	if (newWidth <= 0 || newHeight <= 0) return imageData;

	const scaledData = new Uint8ClampedArray(newWidth * newHeight * 4);

	for (let y = 0; y < newHeight; y++) {
		for (let x = 0; x < newWidth; x++) {
			const originalX = Math.floor(x / xs);
			const originalY = Math.floor(y / ys);
			const originalIndex = (originalY * width + originalX) * 4;
			const newIndex = (y * newWidth + x) * 4;

			for (let i = 0; i < 4; i++) {
				scaledData[newIndex + i] = data[originalIndex + i];
			}
		}
	}

	return {
		colorSpace: imageData.colorSpace,
		data: scaledData,
		width: newWidth,
		height: newHeight,
	} as ImageData;
}

// export interface CreateImageDataOptions {
// 	data: Uint8ClampedArray;
// 	bytesPerScanline: number;
// 	// TODO
// 	// color: any;
// 	/**
// 	 * Array [Col, Row]. default [1, 1]
// 	 */
// 	array?: [number, number];
// }

// export function createImageData(options: CreateImageDataOptions): ImageData {
// 	const { data, bytesPerScanline, array = [1, 1] } = options;

// 	const [col, row] = array;
// 	const w = bytesPerScanline;
// 	const h = data.length;
// 	const pixels = new Uint8ClampedArray(col * w * h * 4);
// 	const dataView = new DataView(pixels.buffer);

// 	for (let i = 0, len = dataView.byteLength; i < len; i += col * w * 4) {
// 		const bitmask = data[i / (col * w * 4)];
// 		let offset = i;

// 		for (let c = 0; c < col; c++) {
// 			for (let n = bytesPerScanline - 1; n >= 0; n--) {
// 				const alpha = ((1 << n) & bitmask) !== 0 ? 255 : 0;
// 				dataView.setUint8(offset + 0, 0);
// 				dataView.setUint8(offset + 1, 0);
// 				dataView.setUint8(offset + 2, 0);
// 				dataView.setUint8(offset + 3, alpha);
// 				offset += 4;
// 			}
// 		}
// 	}

// 	const repeatedPixels = repeatArray(pixels, row);
// 	const imageData = new ImageData(repeatedPixels, w * col);

// 	return imageData;
// 	// Web
// 	// return createImageBitmap(imageData);
// }

export function calMidpoint(points: Point[]): Point {
	const point = points.reduce((prev, item) => prev.add(item), Point.origin());
	return point.divide(points.length);
}
