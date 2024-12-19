import type { Point, Size, ValueFunction } from "./types";
import { Style, TextStyle } from "./graphics";
import { getStyle, getTextStyle } from "./graphics/utils";
import { Matrix } from "./transform";
import { Path } from "./path";
import { ImageResource } from "./graphics/shapes/image";

export enum EntityType {
	matrix,
	canvas,
	rect,
	polygon,
	polyline,
	arc,
	image,
	imagePixel,
	text,
	path,
}

export interface Entity {
	type: EntityType;
}

export interface MatrixEntity extends Entity {
	type: EntityType.matrix;
	matrix: Matrix;
}

export interface CanvasEntity extends Entity {
	type: EntityType.canvas;
	canvas: Canvas;
}

export interface RectEntity extends Entity {
	type: EntityType.rect;
	x: number;
	y: number;
	w: number;
	h: number;
	radii: number;
	style: Style;
}

export interface PolygonEntity extends Entity {
	type: EntityType.polygon;
	points: Point[];
	style: Style;
}

export interface PolylineEntity extends Entity {
	type: EntityType.polyline;
	points: Point[];
	style: Style;
}

export interface ArcEntity extends Entity {
	type: EntityType.arc;
	cx: number;
	cy: number;
	radius: number;
	startAngle: number;
	endAngle: number;
	counterclockwise: boolean;
	style: Style;
}

export interface ImageEntity extends Entity {
	type: EntityType.image;
	image: ImageResource;
	x: number;
	y: number;
	style: Style;
}

export interface ImagePixelEntity extends Entity {
	type: EntityType.imagePixel;
	imageData: ImageData;
	x: number;
	y: number;
	dx: number;
	dy: number;
	dw: number;
	dh: number;
}

export interface TextEntity extends Entity {
	type: EntityType.text;
	x: number;
	y: number;
	text: string;
	style: TextStyle;
}

export interface PathEntity extends Entity {
	type: EntityType.path;
	path: Path;
	style: Style;
}

export type AllEntity =
	| MatrixEntity
	| CanvasEntity
	| RectEntity
	| PolygonEntity
	| PolylineEntity
	| ArcEntity
	| ImageEntity
	| ImagePixelEntity
	| TextEntity
	| PathEntity;

export class EntityFactory {
	public static createMatrixEntity(matrix: Matrix): MatrixEntity {
		return {
			type: EntityType.matrix,
			matrix,
		};
	}

	public static createRectEntity(x: number, y: number, w: number, h: number, radii: number, style: Style): RectEntity {
		return {
			type: EntityType.rect,
			x,
			y,
			w,
			h,
			radii,
			style,
		};
	}

	public static createCanvasEntity(canvas: Canvas): CanvasEntity {
		return {
			type: EntityType.canvas,
			canvas,
		};
	}

	public static createPolygonEntity(points: Point[], style: Style): PolygonEntity {
		return {
			type: EntityType.polygon,
			points,
			style,
		};
	}

	public static createPolylineEntity(points: Point[], style: Style): PolylineEntity {
		return {
			type: EntityType.polyline,
			points,
			style,
		};
	}

	public static createArcEntity(
		cx: number,
		cy: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise: boolean,
		style: Style
	): ArcEntity {
		return {
			type: EntityType.arc,
			cx,
			cy,
			radius,
			startAngle,
			endAngle,
			counterclockwise,
			style,
		};
	}

	public static createImageEntity(image: ImageResource, x: number, y: number, style: Style): ImageEntity {
		return {
			type: EntityType.image,
			x,
			y,
			image,
			style,
		};
	}

	public static createImagePixelEntity(
		imageData: ImageData,
		x: number,
		y: number,
		dx: number,
		dy: number,
		dw: number,
		dh: number
	): ImagePixelEntity {
		return {
			type: EntityType.imagePixel,
			imageData,
			x,
			y,
			dx,
			dy,
			dw,
			dh,
		};
	}

	public static createTextEntity(text: string, x: number, y: number, style: TextStyle): TextEntity {
		return {
			type: EntityType.text,
			x,
			y,
			text,
			style,
		};
	}

	public static createPathEntity(path: Path, style: Style): PathEntity {
		return {
			type: EntityType.path,
			path,
			style,
		};
	}
}

export interface CanvasOptions {
	matrix?: Matrix;
}

export class Canvas {
	public entities: AllEntity[] = [];

	public matrix: Matrix;

	private _currentMatrix: Matrix;

	constructor(options?: CanvasOptions) {
		this.matrix = options?.matrix?.clone() ?? new Matrix();
		this._currentMatrix = this.matrix.clone();
	}

	public addCanvas(canvas: Canvas) {
		this.entities.push(EntityFactory.createCanvasEntity(canvas));
	}

	public translate(x: number, y: number) {
		this._currentMatrix.translate(x, y);
		this.entities.push(EntityFactory.createMatrixEntity(this._currentMatrix.clone()));
	}

	public rotate(xt: number, yt: number) {
		this._currentMatrix.rotate(xt, yt);
		this.entities.push(EntityFactory.createMatrixEntity(this._currentMatrix.clone()));
	}

	public scale(x: number, y: number) {
		this._currentMatrix.scale(x, y);
		this.entities.push(EntityFactory.createMatrixEntity(this._currentMatrix.clone()));
	}

	public drawLine(x1: number, y1: number, x2: number, y2: number, style: Style) {
		const points: Point[] = [
			[x1, y1],
			[x2, y2],
		];

		this.entities.push(EntityFactory.createPolylineEntity(points, style));
	}

	public drawPolygon(points: Point[], style: Style) {
		if (points.length < 3) {
			throw new Error("Polygon must have at least three points");
		}

		this.entities.push(EntityFactory.createPolygonEntity(points, style));
	}

	public drawPolyline(points: Point[], style: Style) {
		if (points.length < 2) {
			throw new Error("Polyline must have at least two points");
		}

		points = points.slice();

		this.entities.push(EntityFactory.createPolylineEntity(points, style));
	}

	public drawRect(x: number, y: number, w: number, h: number, radii: number, style: Style) {
		radii = radii > 0 ? radii : 0;

		this.entities.push(EntityFactory.createRectEntity(x, y, w, h, radii, style));
	}

	public drawCircle(cx: number, cy: number, radius: number, style: Style) {
		this.entities.push(EntityFactory.createArcEntity(cx, cy, radius, 0, 2 * Math.PI, false, style));
	}

	public drawArc(
		cx: number,
		cy: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise: boolean,
		style: Style
	) {
		this.entities.push(EntityFactory.createArcEntity(cx, cy, radius, startAngle, endAngle, counterclockwise, style));
	}

	// drawImage(image:ImageResource, p: Point, size: Size, offsetPoint: Size, offsetSize: Size, style: Style): void;
	// drawImage(image:ImageResource, p: Point, size: Size, style: Style): void;
	// drawImage(image:ImageResource, p: Point, style: Style): void;
	// drawImage(
	// 	image:ImageResource,
	// 	p: Point,
	// 	sizeOrStyle: Size | Style,
	// 	offsetPointOrStyle?: Size | Style,
	// 	offsetSize?: Size,
	// 	style?: Style
	// ): void {
	public drawImage(image: ImageResource, x: number, y: number, style: Style): void {
		this.entities.push(EntityFactory.createImageEntity(image, x, y, style));
	}

	public drawImagePixel(imageData: ImageData, x: number, y: number, dx: number, dy: number, dw: number, dh: number) {
		this.entities.push(EntityFactory.createImagePixelEntity(imageData, x, y, dx, dy, dw, dh));
	}

	public drawText(text: string, x: number, y: number, style: TextStyle) {
		this.entities.push(EntityFactory.createTextEntity(text, x, y, style));
	}

	public drawPath(path: Path, style: Style) {
		this.entities.push(EntityFactory.createPathEntity(path, style));
	}
}
