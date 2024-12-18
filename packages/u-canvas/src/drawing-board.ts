import type { Point, Size, ValueFunction } from "./types";
import { Style, TextStyle } from "./graphics";
import { getStyle, getTextStyle } from "./graphics/utils";
import { Matrix } from "./transform";

// export class Path {
// 	void moveTo(double x, double y);
// 	void lineTo(double x, double y);
// 	void addRect(Rect rect);
// 	void addOval(Rect oval);
// 	void addArc(Rect oval, double startAngle, double sweepAngle);
// 	void addPolygon(List<Offset> points, bool close);
// 	void addPath(Path path, Offset offset, {Float64List? matrix4});
// 	void close();
// }

export enum EntityType {
	matrix,
	drawingBoard,
	rect,
	polygon,
	polyline,
	arc,
	image,
	text,
}

export interface Entity {
	type: EntityType;
}

export interface MatrixEntity extends Entity {
	type: EntityType.matrix;
	matrix: Matrix;
}

export interface DrawingBoardEntity extends Entity {
	type: EntityType.drawingBoard;
	drawingBoard: DrawingBoard;
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

// export interface LineEntity extends Entity {
// 	type: EntityType.line;
// 	x1: number;
// 	y1: number;
// 	x2: number;
// 	y2: number;
// 	style: Style;
// }

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
	x: number;
	y: number;
	image: { src: string };
	style: Style;
}

export interface TextEntity extends Entity {
	type: EntityType.text;
	x: number;
	y: number;
	text: string;
	style: TextStyle;
}

export type AllEntity =
	| MatrixEntity
	| DrawingBoardEntity
	| RectEntity
	// | LineEntity
	| PolygonEntity
	| PolylineEntity
	| ArcEntity
	| ImageEntity
	| TextEntity;

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

	public static createDrawingBoardEntity(drawingBoard: DrawingBoard): DrawingBoardEntity {
		return {
			type: EntityType.drawingBoard,
			drawingBoard,
		};
	}

	// public static createLineEntity(x1: number, y1: number, x2: number, y2: number, style: Style): LineEntity {
	// 	return {
	// 		type: EntityType.line,
	// 		x1,
	// 		y1,
	// 		x2,
	// 		y2,
	// 		style,
	// 	};
	// }

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

	public static createImageEntity(image: { src: string }, x: number, y: number, style: Style): ImageEntity {
		return {
			type: EntityType.image,
			x,
			y,
			image,
			style,
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
}

export interface Record {
	draw: ValueFunction<CanvasRenderingContext2D>;
	style: Style | TextStyle;
}

export interface DrawingBoardOptions {
	matrix?: Matrix;
}

export class DrawingBoard {
	public entities: AllEntity[] = [];

	public matrix: Matrix;
	private _currentMatrix: Matrix;

	constructor(options?: DrawingBoardOptions) {
		this.matrix = options?.matrix?.clone() ?? new Matrix();
		this._currentMatrix = this.matrix.clone();
	}

	addDrawingBoard(drawingBoard: DrawingBoard) {
		this.entities.push(EntityFactory.createDrawingBoardEntity(drawingBoard));
	}

	translate(x: number, y: number) {
		this._currentMatrix.translate(x, y);
		this.entities.push(EntityFactory.createMatrixEntity(this._currentMatrix.clone()));
	}

	drawLine(x1: number, y1: number, x2: number, y2: number, style: Style) {
		const points: Point[] = [
			[x1, y1],
			[x2, y2],
		];

		this.entities.push(EntityFactory.createPolylineEntity(points, style));
	}

	drawPolygon(points: Point[], style: Style) {
		if (points.length < 3) {
			throw new Error("Polygon must have at least three points");
		}

		this.entities.push(EntityFactory.createPolygonEntity(points, style));
	}

	drawPolyline(points: Point[], style: Style) {
		if (points.length < 2) {
			throw new Error("Polyline must have at least two points");
		}

		points = points.slice();

		this.entities.push(EntityFactory.createPolylineEntity(points, style));
	}

	drawRect(x: number, y: number, w: number, h: number, radii: number, style: Style) {
		radii = radii > 0 ? radii : 0;

		this.entities.push(EntityFactory.createRectEntity(x, y, w, h, radii, style));
	}

	drawCircle(cx: number, cy: number, radius: number, style: Style) {
		this.entities.push(EntityFactory.createArcEntity(cx, cy, radius, 0, 2 * Math.PI, false, style));
	}

	drawArc(
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

	// void drawPath(Path path, DrawingBoard paint);
	// drawImage(image: { src: string }, p: Point, size: Size, offsetPoint: Size, offsetSize: Size, style: Style): void;
	// drawImage(image: { src: string }, p: Point, size: Size, style: Style): void;
	// drawImage(image: { src: string }, p: Point, style: Style): void;
	// drawImage(
	// 	image: { src: string },
	// 	p: Point,
	// 	sizeOrStyle: Size | Style,
	// 	offsetPointOrStyle?: Size | Style,
	// 	offsetSize?: Size,
	// 	style?: Style
	// ): void {
	drawImage(image: { src: string }, x: number, y: number, style: Style): void {
		this.entities.push(EntityFactory.createImageEntity(image, x, y, style));
	}

	drawText(text: string, x: number, y: number, style: TextStyle) {
		this.entities.push(EntityFactory.createTextEntity(text, x, y, style));
	}

	// void drawPoints(PointMode pointMode, List<Offset> points, DrawingBoard paint);
	// void drawVertices(Vertices vertices, BlendMode blendMode, DrawingBoard paint);
}
