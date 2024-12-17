import { getStyle } from "../graphics/utils";
import { Offset } from "../offset";
import { Paintable } from "../types";
import { UCanvas } from "../u-canvas";
import { Paint } from "../u-paint";
import {
	ArcEntity,
	DrawingBoard,
	DrawingBoardEntity,
	EntityFactory,
	EntityType,
	ImageEntity,
	MatrixEntity,
	PolygonEntity,
	PolylineEntity,
	RectEntity,
	TextEntity,
} from "../drawing-board";
import { Style, TextStyle } from "../graphics";
import { Matrix } from "../transform";

export class Renderer {
	private canvas: UCanvas;

	constructor(canvas: UCanvas) {
		this.canvas = canvas;
	}

	// public render(graphic: Paintable, offset?: Offset): void {
	// public _render(graphic: Paintable, offset?: Offset): void {
	// offset = new Offset(0, 0);

	// graphic.paint(this.canvas.ctx, offset);
	// }

	public renderRoot(): void {
		const offset = new Offset(0, 0);
		const paint = new Paint();
		const board = new DrawingBoard({
			matrix: this.canvas.root.worldMatrix,
		});
		// board.matrix = this.canvas.root.worldMatrix;
		this.canvas.root.paint(board, offset);
		const entity = EntityFactory.createDrawingBoardEntity(board);
		renderDrawingBoard(entity, this.canvas.ctx);
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

function renderDrawingBoard(entity: DrawingBoardEntity, ctx: CanvasRenderingContext2D): void {
	let matrix = entity.drawingBoard.matrix;
	const entities = entity.drawingBoard.entities;

	for (const entity of entities) {
		ctx.save();
		ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		const oldStyle = getStyle(ctx);

		const actions = {
			[EntityType.arc]: (entity: ArcEntity) => renderArc(entity, ctx),
			[EntityType.drawingBoard]: (entity: DrawingBoardEntity) => renderDrawingBoard(entity, ctx),
			[EntityType.image]: (entity: ImageEntity) => renderImage(entity, ctx),
			[EntityType.matrix]: (entity: MatrixEntity) => (matrix = entity.matrix),
			[EntityType.polygon]: (entity: PolygonEntity) => renderPolygon(entity, ctx),
			[EntityType.polyline]: (entity: PolylineEntity) => renderPolyline(entity, ctx),
			[EntityType.rect]: (entity: RectEntity) => renderRect(entity, ctx),
			[EntityType.text]: (entity: TextEntity) => renderText(entity, ctx),
		};

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
