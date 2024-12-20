// import { v4 as uuid } from "uuid";
import type { Line, Point } from "../types";
import type { Style } from "./styles";
import { StrokeCap, StrokeJoin, FontWeight } from "./styles";

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
			fontWeight: fontWeight as unknown as FontWeight,
			direction: options.direction,
			letterSpacing: parseFloat(options.letterSpacing),
			wordSpacing: parseFloat(options.wordSpacing),
			textAlign: options.textAlign,
			textBaseline: options.textBaseline,
			textRendering: options.textRendering,
		},
	};
}

export function isPointOnLineSegment(point: Point, line: Line): boolean {
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

	return new ImageData(scaledData, newWidth, newHeight);
}

export interface CreateImageDataOptions {
	data: Uint8ClampedArray;
	bytesPerScanline: number;
	// TODO
	// color: any;
	/**
	 * Array [Col, Row]. default [1, 1]
	 */
	array?: [number, number];
}

export function createImageData(options: CreateImageDataOptions): ImageData {
	const { data, bytesPerScanline, array = [1, 1] } = options;

	const [col, row] = array;
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

	return imageData;
	// Web
	// return createImageBitmap(imageData);
}

export function calMidpoint(points: Point[]): Point {
	const [x, y] = points.reduce(
		(prev, item) => {
			prev[0] += item[0];
			prev[1] += item[1];
			return prev;
		},
		[0, 0]
	);

	return [x / points.length, y / points.length];
}
