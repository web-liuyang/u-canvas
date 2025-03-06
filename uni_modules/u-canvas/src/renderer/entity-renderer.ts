import type { CanvasFontWeight, Style } from "../graphics";
import type {
	AllEntity,
	ArcEntity,
	CanvasEntity,
	ImageEntity,
	ImagePixelEntity,
	MatrixEntity,
	PathEntity,
	PolygonEntity,
	PolylineEntity,
	RectEntity,
	TextEntity,
} from "./entity";

import { defaultStyle, extractStyle, scaleImageData } from "../graphics";
import { EntityType } from "./entity";
import { Point } from "../offset";
import { RecordType } from "./recored";

export function applyStyle(ctx: CanvasRenderingContext2D, style?: Style): void {
	// Stroke
	ctx.strokeStyle = style?.stroke?.color ?? ctx.strokeStyle;
	ctx.lineWidth = style?.stroke?.width ?? ctx.lineWidth;
	ctx.lineCap = style?.stroke?.cap ?? ctx.lineCap;
	ctx.lineJoin = style?.stroke?.join ?? ctx.lineJoin;

	// Fill
	ctx.fillStyle = style?.fill?.color ?? ctx.fillStyle;

	// Text
	const font = ctx.font.split(" ");
	if (font.length === 2) font.unshift("normal");
	const fontWeight = (() => {
		const fontWeight = style?.text?.fontWeight ?? (font[0] as CanvasFontWeight);
		// normal 不需要设置上去, 要不然字体设置无效
		// 仅支持 bold
		return fontWeight === "bold" ? fontWeight : "";
	})();
	const fontSize = style?.text?.fontSize ?? parseFloat(font[1]);
	const fontFamily = style?.text?.fontFamily ?? font[2];
	// 注意App平台只支持font-weight、font-size、font-family

	const letterSpacing = style?.text?.letterSpacing ?? parseFloat(ctx.letterSpacing);
	const wordSpacing = style?.text?.wordSpacing ?? parseFloat(ctx.wordSpacing);

	ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`.trim();
	ctx.direction = style?.text?.direction ?? ctx.direction;
	ctx.letterSpacing = `${letterSpacing}px`;
	ctx.wordSpacing = `${wordSpacing}px`;
	ctx.textAlign = style?.text?.textAlign ?? ctx.textAlign;
	ctx.textBaseline = style?.text?.textBaseline ?? ctx.textBaseline;
	ctx.textRendering = style?.text?.textRendering ?? ctx.textRendering;
}

export function renderCanvas(entity: CanvasEntity, ctx: CanvasRenderingContext2D): void {
	let matrix = entity.canvas.matrix;
	const entities = entity.canvas.entities;

	for (const entity of entities) {
		ctx.save();
		ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		const oldStyle = extractStyle(ctx);
		ctx.beginPath();
		const actions = {
			[EntityType.arc]: (entity: AllEntity) => renderArc(entity as ArcEntity, ctx),
			[EntityType.canvas]: (entity: AllEntity) => renderCanvas(entity as CanvasEntity, ctx),
			[EntityType.image]: (entity: AllEntity) => renderImage(entity as ImageEntity, ctx),
			[EntityType.imagePixel]: (entity: AllEntity) => renderImagePixel(entity as ImagePixelEntity, ctx),
			[EntityType.matrix]: (entity: AllEntity) =>
				(() => {
					matrix = (entity as MatrixEntity).matrix;
				})(),
			[EntityType.polygon]: (entity: AllEntity) => renderPolygon(entity as PolygonEntity, ctx),
			[EntityType.polyline]: (entity: AllEntity) => renderPolyline(entity as PolylineEntity, ctx),
			[EntityType.rect]: (entity: AllEntity) => renderRect(entity as RectEntity, ctx),
			[EntityType.text]: (entity: AllEntity) => renderText(entity as TextEntity, ctx),
			[EntityType.path]: (entity: AllEntity) => renderPath(entity as PathEntity, ctx),
		};
		const action = actions[entity.type];
		action(entity);

		applyStyle(ctx, oldStyle);
		ctx.restore();
	}
}

export function renderRect(entity: RectEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h, radii, style } = entity;
	drawRoundedRectPath(ctx, entity);
	colorize(ctx, style);
}

export function renderText(entity: TextEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, text, style } = entity;

	applyStyle(ctx, style);

	if (style?.fill !== undefined && style?.stroke !== undefined) {
		ctx.fillText(text, x, y);
		ctx.strokeText(text, x, y);
	} else if (style?.stroke !== undefined) {
		ctx.strokeText(text, x, y);
	} else {
		ctx.fillText(text, x, y);
	}
}

export function renderImage(entity: ImageEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h, sx, sy, sw, sh, image, style } = entity;
	applyStyle(ctx, style);

	if (sx && sy && sw && sh && x && y && w && h) {
		// @ts-expect-error uniapp api
		ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
	} else if (x && y && w && h) {
		// @ts-expect-error uniapp api
		ctx.drawImage(image, x, y, w, h);
	} else {
		// @ts-expect-error uniapp api
		ctx.drawImage(image, x, y);
	}
}

export function renderImagePixel(entity: ImagePixelEntity, ctx: CanvasRenderingContext2D): void {
	// 应该会有一个参数给用户选择 用方法一还是二进行渲染
	let { imageData, dx, dy, dw, dh } = entity;
	// 方法一：保证绘制的图片数据跟随 Matrix 不会模糊，但如果不是整数倍的缩放就会有一些像素失真。
	const matrix = ctx.getMatrix();
	const xs = matrix.a;
	const ys = matrix.d;
	const { x, y } = matrix.apply(new Point(entity.x, entity.y));

	// TODO 这段在ios模拟器与mp真机调试运行会出现卡顿, mp预览不会卡顿
	imageData = scaleImageData(imageData, xs, ys);
	imageData = ctx.createCompatibleImageData(imageData.data, imageData.width, imageData.height);
	dx *= xs;
	dy *= ys;
	dw *= xs;
	dh *= ys;
	ctx.putImageData(imageData, x, y, dx, dy, dw, dh);

	// 方法二：保证绘制的图片数据跟随 Matrix 会模糊，但不会像素失真。
	// createImageBitmap(imageData).then(res => {
	// 	ctx.drawImage(res, x, y);
	// });
}

export function renderArc(entity: ArcEntity, ctx: CanvasRenderingContext2D): void {
	const { cx, cy, radius, startAngle, endAngle, counterclockwise, style } = entity;

	ctx.arc(cx, cy, radius, startAngle, endAngle, counterclockwise);
	colorize(ctx, style);
}

export function renderPolyline(entity: PolylineEntity, ctx: CanvasRenderingContext2D): void {
	const { points, style } = entity;
	const [first, ...remaining] = points;
	ctx.moveTo(first.x, first.y);

	for (const { x, y } of remaining) {
		ctx.lineTo(x, y);
	}

	colorize(ctx, style);
}

export function renderPolygon(entity: PolygonEntity, ctx: CanvasRenderingContext2D): void {
	const { points, style } = entity;
	const [first, ...remaining] = points;
	ctx.moveTo(first.x, first.y);

	for (const { x, y } of remaining) {
		ctx.lineTo(x, y);
	}

	colorize(ctx, style);
}

export function renderPath(entity: PathEntity, ctx: CanvasRenderingContext2D): void {
	const { path, style } = entity;

	for (const record of path.records) {
		switch (record.type) {
			case RecordType.moveTo:
				ctx.moveTo(record.x, record.y);
				break;
			case RecordType.lineTo:
				ctx.lineTo(record.x, record.y);
				break;
			case RecordType.rect:
				drawRoundedRectPath(ctx, record);
				break;
			case RecordType.arc:
				ctx.arc(record.cx, record.cy, record.radius, record.startAngle, record.endAngle, record.counterclockwise);
				break;
			case RecordType.closePath:
				ctx.closePath();
				break;
			case RecordType.arcTo:
				ctx.arcTo(record.x1, record.y1, record.x2, record.y2, record.radius);
				break;
		}
	}

	colorize(ctx, style);
}

/**
 * 路径上色
 * @param style 样式，默认以 stroke 方式上色
 * @param ctx canvas 上下文
 */
export function colorize(ctx: CanvasRenderingContext2D, style?: Style) {
	applyStyle(ctx, style);

	if (style?.fill !== undefined && style?.stroke !== undefined) {
		ctx.fill();
		ctx.stroke();
	} else if (style?.fill !== undefined) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
}

interface SimpleRect {
	x: number;
	y: number;
	w: number;
	h: number;
	radii: number;
}

function drawRoundedRectPath(ctx: CanvasRenderingContext2D, rect: SimpleRect) {
	const { x, y, w, h, radii } = rect;
	const points: Point[] = [new Point(x, y), new Point(x + w, y), new Point(x + w, y + h), new Point(x, y + h)];

	ctx.moveTo(points[0].x, points[0].y + radii);
	ctx.quadraticCurveTo(points[0].x, points[0].y, points[0].x + radii, points[0].y);

	ctx.lineTo(points[1].x - radii, points[1].y);
	ctx.quadraticCurveTo(points[1].x, points[1].y, points[1].x, points[1].y + radii);

	ctx.lineTo(points[2].x, points[2].y - radii);
	ctx.quadraticCurveTo(points[2].x, points[2].y, points[2].x - radii, points[2].y);

	ctx.lineTo(points[3].x + radii, points[3].y);
	ctx.quadraticCurveTo(points[3].x, points[3].y, points[3].x, points[3].y - radii);

	ctx.closePath();
}
