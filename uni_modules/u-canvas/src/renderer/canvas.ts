import type { AllEntity } from "./entity";
import type { Style, ImageResource } from "../graphics";
import { EntityFactory } from "./entity";
import { Path } from "./path";
import { Matrix } from "../transform";
import { Point } from "../offset";

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

	public addCanvas(canvas: Canvas, style?: Style) {
		this.entities.push(EntityFactory.createCanvasEntity(canvas, style));
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

	public drawLine(x1: number, y1: number, x2: number, y2: number, style?: Style) {
		const points: Point[] = [new Point(x1, y1), new Point(x2, y2)];

		this.entities.push(EntityFactory.createPolylineEntity(points, style));
	}

	public drawPolygon(points: Point[], style?: Style) {
		if (points.length < 3) {
			throw new Error("Polygon must have at least three points");
		}

		this.entities.push(EntityFactory.createPolygonEntity(points, style));
	}

	public drawPolyline(points: Point[], style?: Style) {
		if (points.length < 2) {
			throw new Error("Polyline must have at least two points");
		}

		points = points.slice();

		this.entities.push(EntityFactory.createPolylineEntity(points, style));
	}

	public drawRect(x: number, y: number, w: number, h: number, radii: number, style?: Style) {
		radii = radii > 0 ? radii : 0;

		this.entities.push(EntityFactory.createRectEntity(x, y, w, h, radii, style));
	}

	public drawCircle(cx: number, cy: number, radius: number, style?: Style) {
		this.entities.push(EntityFactory.createArcEntity(cx, cy, radius, 0, 2 * Math.PI, false, style));
	}

	public drawArc(
		cx: number,
		cy: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise: boolean,
		style?: Style
	) {
		this.entities.push(EntityFactory.createArcEntity(cx, cy, radius, startAngle, endAngle, counterclockwise, style));
	}

	public drawImage(image: ImageResource, x: number, y: number): void {
		this.entities.push(EntityFactory.createImageEntity(image, x, y));
	}

	public drawImagePixel(imageData: ImageData, x: number, y: number, dx: number, dy: number, dw: number, dh: number) {
		this.entities.push(EntityFactory.createImagePixelEntity(imageData, x, y, dx, dy, dw, dh));
	}

	public drawText(text: string, x: number, y: number, style?: Style) {
		this.entities.push(EntityFactory.createTextEntity(text, x, y, style));
	}

	public drawPath(path: Path, style?: Style) {
		this.entities.push(EntityFactory.createPathEntity(path, style));
	}
}
