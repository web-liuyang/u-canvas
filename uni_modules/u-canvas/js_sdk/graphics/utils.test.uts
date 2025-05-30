// import type { extractStyleOptions, GetTextStyleOptions } from "./utils";
import { describe, it, expect } from "vitest";
// import { createImageData, extractStyle, isPointOnLineSegment, scaleImageData } from "./utils";
import { extractStyle, isPointOnLineSegment, scaleImageData } from "./utils";
// import { Style, Stroke, StrokeCap, StrokeJoin, Fill, TextStyle } from "./styles";
import { CanvasRenderingContext2D } from "@dcloudio/uni-app-x/types/native";
import { Line, Point } from "../coords";
// import { Line, Point } from "../types";

describe("extractStyle", () => {
	// it("extractStyle(object)", () => {
	// 	expect(
	// 		extractStyle({
	// 			fillStyle: "#000",
	// 			strokeStyle: "#000",
	// 			lineWidth: 1,
	// 			lineCap: StrokeCap.butt,
	// 			lineJoin: StrokeJoin.miter,
	// 		} as CanvasRenderingContext2D)
	// 	).toEqual({
	// 		stroke: new Stroke({ color: "#000", width: 1, cap: StrokeCap.butt, join: StrokeJoin.miter }),
	// 		fill: new Fill({ color: "#000" }),
	// 	});
	// });

	// it("getTextStyle(object)", () => {
	// 	expect(
	// 		getTextStyle({
	// 			font: "20px serif",
	// 			direction: "ltr",
	// 			letterSpacing: "0px",
	// 			wordSpacing: "0px",
	// 			textAlign: "start",
	// 			textBaseline: "alphabetic",
	// 			textRendering: "auto",

	// 			fillStyle: "#000",
	// 			strokeStyle: "#000",
	// 			lineWidth: 1,
	// 			lineCap: StrokeCap.butt,
	// 			lineJoin: StrokeJoin.miter,
	// 		} as GetTextStyleOptions)
	// 	).toEqual(
	// 		new TextStyle({
	// 			fontSize: 20,
	// 			fontFamily: "serif",
	// 			direction: "ltr",
	// 			letterSpacing: 0,
	// 			wordSpacing: 0,
	// 			textAlign: "start",
	// 			textBaseline: "alphabetic",
	// 			textRendering: "auto",
	// 			stroke: new Stroke({ color: "#000", width: 1, cap: StrokeCap.butt, join: StrokeJoin.miter }),
	// 			fill: new Fill({ color: "#000" }),
	// 		})
	// 	);
	// });

	// it("createPatternBitmap(object)", async () => {
	// 	const imageBitmap = await createImageData({
	// 		data: new Uint8ClampedArray([
	// 			parseInt("10", 2), //
	// 			parseInt("01", 2),
	// 		]),
	// 		bytesPerScanline: 2,
	// 	});

	// 	expect(imageBitmap.width).toBe(2);
	// 	expect(imageBitmap.height).toBe(2);
	// });

	// it("scale(ImageData, sx, sy)", async () => {
	// 	const imageBitmap = createImageData({
	// 		data: new Uint8ClampedArray([
	// 			//
	// 			parseInt("10", 2),
	// 			parseInt("01", 2),
	// 		]),
	// 		bytesPerScanline: 2,
	// 	});
	// 	const sx = 2;
	// 	const sy = 2;
	// 	const scaledImageData = scaleImageData(imageBitmap, sx, sy);

	// 	const expectedImageBitmap = createImageData({
	// 		data: new Uint8ClampedArray([
	// 			//
	// 			parseInt("1100", 2),
	// 			parseInt("1100", 2),
	// 			parseInt("0011", 2),
	// 			parseInt("0011", 2),
	// 		]),
	// 		bytesPerScanline: 4,
	// 	});

	// 	expect(expectedImageBitmap).toStrictEqual(scaledImageData);
	// });

	it("isPointOnLineSegment(point, line)", async () => {
		expect(isPointOnLineSegment(new Point(1, 1), new Line(new Point(2, 3), new Point(2, 0)), 0)).toBe(false);
		expect(isPointOnLineSegment(new Point(1, 1), new Line(new Point(2, 3), new Point(2, 0)), 1)).toBe(true);
		expect(isPointOnLineSegment(new Point(1, 1), new Line(new Point(2, 3), new Point(2, 0)), 2)).toBe(true);
	});

	it("t(point, line)", async () => {
		const p = new Point(2, 3);
		const line = new Line(new Point(1, 2), new Point(4, 2));
		// const cos =

		console.log(9 * Math.sin(2 / 9));
	});
});
