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

export type GetStyleOptions = Pick<CanvasFillStrokeStyles, "strokeStyle" | "fillStyle"> &
	Pick<CanvasPathDrawingStyles, "lineWidth" | "lineCap" | "lineJoin">;

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
