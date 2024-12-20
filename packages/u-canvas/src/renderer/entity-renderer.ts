import { Style, TextStyle } from "../graphics";
import { getStyle, scaleImageData } from "../graphics/utils";
import { Matrix } from "../transform";
import {
	AllEntity,
	ArcEntity,
	CanvasEntity,
	EntityType,
	ImageEntity,
	ImagePixelEntity,
	MatrixEntity,
	PathEntity,
	PolygonEntity,
	PolylineEntity,
	RectEntity,
	TextEntity,
} from "./entity";
import { RecordType } from "./recored";

export function applyStyle(ctx: CanvasRenderingContext2D, style: Style | TextStyle): void {
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

export function renderCanvas(entity: CanvasEntity, ctx: CanvasRenderingContext2D): void {
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

export function renderRect(entity: RectEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h, radii, style } = entity;
	applyStyle(ctx, style);

	ctx.roundRect(x, y, w, h, radii);
	ctx.fill();
	ctx.stroke();
}

export function renderText(entity: TextEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, text, style } = entity;
	applyStyle(ctx, style);

	ctx.fillText(text, x, y);
	ctx.strokeText(text, x, y);
}

export function renderImage(entity: ImageEntity, ctx: CanvasRenderingContext2D): void {
	const { x, y, image, style } = entity;
	applyStyle(ctx, style);

	// @ts-expect-error uniapp api
	ctx.drawImage(image, x, y);
}

export function renderImagePixel(entity: ImagePixelEntity, ctx: CanvasRenderingContext2D): void {
	// 应该会有一个参数给用户选择 用方法一还是二进行渲染
	let { imageData, x, y, dx, dy, dw, dh } = entity;
	// 方法一：保证绘制的图片数据跟随 Matrix 不会模糊，但如果不是整数倍的缩放就会有一些像素失真。
	// 并且进行缩放平移时Canvas有卡顿，不知道是优化问题，还是我计算问题
	const matrix = Matrix.fromDOMMatrix(ctx.getTransform());
	const xs = matrix.a;
	const ys = matrix.d;
	imageData = scaleImageData(imageData, xs, ys);
	[x, y] = matrix.applyVector(x, y);
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
	applyStyle(ctx, style);

	ctx.arc(cx, cy, radius, startAngle, endAngle, counterclockwise);
	ctx.stroke();
	ctx.fill();
}

export function renderPolyline(entity: PolylineEntity, ctx: CanvasRenderingContext2D): void {
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

export function renderPolygon(entity: PolygonEntity, ctx: CanvasRenderingContext2D): void {
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

export function renderPath(entity: PathEntity, ctx: CanvasRenderingContext2D): void {
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
