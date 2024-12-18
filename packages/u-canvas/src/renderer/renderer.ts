import { getStyle } from "../graphics/utils";
import { Offset } from "../offset";
import { Paintable } from "../types";
import { UCanvas } from "../u-canvas";
import { Paint } from "../u-paint";
import {
	AllEntity,
	ArcEntity,
	Canvas,
	CanvasEntity,
	EntityFactory,
	EntityType,
	ImageEntity,
	ImagePixelEntity,
	MatrixEntity,
	PathEntity,
	PolygonEntity,
	PolylineEntity,
	RectEntity,
	TextEntity,
} from "../canvas";
import { Style, TextStyle } from "../graphics";
import { Matrix } from "../transform";
import { RecordType } from "../path";

export class Renderer {
	private canvas: UCanvas;

	constructor(canvas: UCanvas) {
		this.canvas = canvas;
	}

	public renderRoot(): void {
		const offset = new Offset(0, 0);
		const paint = new Paint();
		const canvas = new Canvas({
			matrix: this.canvas.root.worldMatrix,
		});
		// canvas.matrix = this.canvas.root.worldMatrix;
		this.canvas.root.paint(canvas, offset);
		const entity = EntityFactory.createCanvasEntity(canvas);
		renderCanvas(entity, this.canvas.ctx);
	}

	// protected draw(
	// 	ctx: CanvasRenderingContext2D,
	// 	fn: (ctx: CanvasRenderingContext2D) => void,
	// 	options: {
	// 		style: Style | TextStyle;
	// 		matrix: Matrix;
	// 	}
	// ): void {
	// 	const { style, matrix } = options;

	// 	ctx.save();
	// 	ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
	// 	const oldStyle = getStyle(ctx);
	// 	this.applyStyle(ctx, style);
	// 	fn(ctx);
	// 	this.applyStyle(ctx, oldStyle);
	// 	ctx.restore();
	// }

	// protected applyStyle(ctx: CanvasRenderingContext2D, style: Style | TextStyle): void {
	// 	ctx.strokeStyle = style.stroke.color;
	// 	ctx.lineWidth = style.stroke.width;
	// 	ctx.lineCap = style.stroke.cap;
	// 	ctx.lineJoin = style.stroke.join;
	// 	ctx.fillStyle = style.fill.color;

	// 	if (style instanceof TextStyle) {
	// 		ctx.font = `${style.fontSize}px ${style.fontFamily}`;
	// 		ctx.direction = style.direction;
	// 		ctx.letterSpacing = `${style.letterSpacing}px`;
	// 		ctx.wordSpacing = `${style.wordSpacing}px`;
	// 		ctx.textAlign = style.textAlign;
	// 		ctx.textBaseline = style.textBaseline;
	// 		ctx.textRendering = style.textRendering;
	// 	}
	// }
}

function applyStyle(ctx: CanvasRenderingContext2D, style: Style | TextStyle): void {
	ctx.strokeStyle = style.stroke.color;
	ctx.lineWidth = style.stroke.width;
	ctx.lineCap = style.stroke.cap;
	ctx.lineJoin = style.stroke.join;
	ctx.fillStyle = style.fill.color;

	if (style instanceof TextStyle) {
		ctx.font = `${style.fontSize}px ${style.fontFamily}`;
		ctx.direction = style.direction;
		ctx.letterSpacing = `${style.letterSpacing}px`;
		ctx.wordSpacing = `${style.wordSpacing}px`;
		ctx.textAlign = style.textAlign;
		ctx.textBaseline = style.textBaseline;
		ctx.textRendering = style.textRendering;
	}
}

function renderCanvas(entity: CanvasEntity, ctx: CanvasRenderingContext2D): void {
	let matrix = entity.canvas.matrix;
	const entities = entity.canvas.entities;

	for (const entity of entities) {
		ctx.save();
		ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		const oldStyle = getStyle(ctx);
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

function renderRect(entity: RectEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h, radii, style } = entity;
	applyStyle(ctx, style);

	ctx.roundRect(x, y, w, h, radii);
	ctx.fill();
	ctx.stroke();
}

function renderText(entity: TextEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, text, style } = entity;
	applyStyle(ctx, style);

	ctx.fillText(text, x, y);
	ctx.strokeText(text, x, y);
}

function renderImage(entity: ImageEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, image, style } = entity;
	applyStyle(ctx, style);

	// @ts-expect-error uniapp api
	ctx.drawImage(image, x, y);
}

function renderImagePixel(entity: ImagePixelEntity, ctx: CanvasRenderingContext2D): void {
	const { imageData, x, y, dx, dy, dw, dh } = entity;

	ctx.putImageData(imageData, x, y, dx, dy, dw, dh);
}

function renderArc(entity: ArcEntity, ctx: CanvasRenderingContext2D): void {
	const { cx, cy, radius, startAngle, endAngle, counterclockwise, style } = entity;
	applyStyle(ctx, style);

	ctx.arc(cx, cy, radius, startAngle, endAngle, counterclockwise);
	ctx.stroke();
	ctx.fill();
}

function renderPolyline(entity: PolylineEntity, ctx: CanvasRenderingContext2D): void {
	const { points, style } = entity;
	applyStyle(ctx, style);

	const [[fx1, fx2], ...remaining] = points;
	ctx.moveTo(fx1, fx2);

	for (const [x, y] of remaining) {
		ctx.lineTo(x, y);
	}

	ctx.stroke();
	// Polyline应该是不需要fill的
	ctx.fill();
}

function renderPolygon(entity: PolygonEntity, ctx: CanvasRenderingContext2D): void {
	const { points, style } = entity;
	applyStyle(ctx, style);

	const [[fx1, fx2], ...remaining] = points;
	ctx.moveTo(fx1, fx2);

	for (const [x, y] of remaining) {
		ctx.lineTo(x, y);
	}

	ctx.stroke();
	ctx.fill();
}

function renderPath(entity: PathEntity, ctx: CanvasRenderingContext2D): void {
	const { path, style } = entity;
	applyStyle(ctx, style);

	for (const record of path.records) {
		switch (record.type) {
			case RecordType.moveTo:
				ctx.moveTo(record.x, record.y);
				break;
			case RecordType.lineTo:
				ctx.lineTo(record.x, record.y);
				break;
			case RecordType.rect:
				ctx.roundRect(record.x, record.y, record.w, record.h, record.radii);
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

	ctx.stroke();
	ctx.fill();
}
