import type { GetStyleOptions, GetTextStyleOptions } from "./utils";
import { describe, it, expect } from "vitest";
import { createImageData, getStyle, getTextStyle } from "./utils";
import { Style, Stroke, StrokeCap, StrokeJoin, Fill, TextStyle } from "./styles";

describe("getStyle", () => {
	it("getStyle(object)", () => {
		expect(
			getStyle({
				fillStyle: "#000",
				strokeStyle: "#000",
				lineWidth: 1,
				lineCap: StrokeCap.butt,
				lineJoin: StrokeJoin.miter,
			} as GetStyleOptions),
		).toEqual(
			new Style({
				stroke: new Stroke({ color: "#000", width: 1, cap: StrokeCap.butt, join: StrokeJoin.miter }),
				fill: new Fill({ color: "#000" }),
			}),
		);
	});

	it("getTextStyle(object)", () => {
		expect(
			getTextStyle({
				font: "20px serif",
				direction: "ltr",
				letterSpacing: "0px",
				wordSpacing: "0px",
				textAlign: "start",
				textBaseline: "alphabetic",
				textRendering: "auto",

				fillStyle: "#000",
				strokeStyle: "#000",
				lineWidth: 1,
				lineCap: StrokeCap.butt,
				lineJoin: StrokeJoin.miter,
			} as GetTextStyleOptions),
		).toEqual(
			new TextStyle({
				fontSize: 20,
				fontFamily: "serif",
				direction: "ltr",
				letterSpacing: 0,
				wordSpacing: 0,
				textAlign: "start",
				textBaseline: "alphabetic",
				textRendering: "auto",
				stroke: new Stroke({ color: "#000", width: 1, cap: StrokeCap.butt, join: StrokeJoin.miter }),
				fill: new Fill({ color: "#000" }),
			}),
		);
	});

	it("createPatternBitmap(object)", async () => {
		const imageBitmap = await createImageData({
			data: new Uint8ClampedArray([
				parseInt("10", 2), //
				parseInt("01", 2),
			]),
			bytesPerScanline: 2,
		});

		expect(imageBitmap.width).toBe(2);
		expect(imageBitmap.height).toBe(2);
	});
});
