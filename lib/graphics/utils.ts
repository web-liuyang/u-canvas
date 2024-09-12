import type { StrokeCap, StrokeJoin } from "./stroke";
// import { v4 as uuid } from "uuid";
import { Style } from "./style";
import { Stroke } from "./stroke";
import { Fill } from "./fill";
import { TextStyle } from "./text-style";

export function generateUUID(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export type GetStyleOptions = CanvasRenderingContext2D;

export type GetTextStyleOptions = CanvasRenderingContext2D;

export function getStyle(options: GetStyleOptions): Style {
	return new Style({
		stroke: new Stroke({
			color: options.strokeStyle as string,
			width: options.lineWidth,
			cap: options.lineCap as StrokeCap,
			join: options.lineJoin as StrokeJoin,
		}),
		fill: new Fill({ color: options.fillStyle as string }),
	});
}

export function getTextStyle(options: GetTextStyleOptions): TextStyle {
	const [fontSize, fontFamily] = options.font.split(" ");
	const style = getStyle(options);

	return new TextStyle({
		fontSize: parseFloat(fontSize),
		fontFamily: fontFamily,
		direction: options.direction,
		letterSpacing: parseFloat(options.letterSpacing),
		wordSpacing: parseFloat(options.wordSpacing),
		textAlign: options.textAlign,
		textBaseline: options.textBaseline,
		textRendering: options.textRendering,
		stroke: style.stroke,
		fill: style.fill,
	});
}

export function isPointOnLineSegment(point: Point, line: [Point, Point]): boolean {
	const vectorAP = [point[0] - line[0][0], point[1] - line[0][1]];
	const vectorAB = [line[1][0] - line[0][0], line[1][1] - line[0][1]];

	// 共线
	const cross = vectorAP[0] * vectorAB[1] - vectorAP[1] * vectorAB[0];
	if (cross !== 0) return false;

	// 两点之间
	const squaredLengthAB = Math.pow(vectorAB[0], 2) + Math.pow(vectorAB[1], 2);
	const dotProduct = vectorAP[0] * vectorAB[0] + vectorAP[1] * vectorAB[1];
	if (dotProduct < 0 || dotProduct > squaredLengthAB) return false;

	return true;
}

export function repeatArray(array: Uint8ClampedArray, count: number): Uint8ClampedArray {
	const result = new Uint8ClampedArray(array.length * count);
	for (let i = 0; i < count; i++) {
		result.set(array, i * array.length);
	}
	return result;
}

export interface CreatePatternBitmapOptions {
	data: Uint8ClampedArray;
	bytesPerScanline: number;
	// TODO
	// color: any;
	/**
	 * Array [Row, Col]
	 * @default [1, 1]
	 */
	array?: [number, number];
}

export function createPatternBitmap(options: CreatePatternBitmapOptions): Promise<ImageBitmap> {
	const { data, bytesPerScanline, array = [1, 1] } = options;

	const [row, col] = array;
	const w = bytesPerScanline;
	const h = data.length;
	const pixels = new Uint8ClampedArray(col * w * h * 4);
	const dataView = new DataView(pixels.buffer);

	for (let i = 0, len = dataView.byteLength; i < len; i += col * w * 4) {
		const bitmask = data[i / (col * w * 4)];
		let offset = i;

		for (let c = 0; c < col; c++) {
			for (let n = bytesPerScanline - 1; n >= 0; n--) {
				const alpha = ((1 << n) & bitmask) !== 0 ? 255 : 0;
				dataView.setUint8(offset + 0, 0);
				dataView.setUint8(offset + 1, 0);
				dataView.setUint8(offset + 2, 0);
				dataView.setUint8(offset + 3, alpha);
				offset += 4;
			}
		}
	}

	const repeatedPixels = repeatArray(pixels, row);
	const imageData = new ImageData(repeatedPixels, w * col);

	return createImageBitmap(imageData);
}
