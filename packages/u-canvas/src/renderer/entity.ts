import { Canvas } from "./canvas";
import { Style, TextStyle } from "../graphics";
import { ImageResource } from "../graphics/shapes/image";
import { Path } from "./path";
import { Matrix } from "../transform";
import { Point } from "../types";

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
