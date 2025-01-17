import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset, Point } from "../../offset";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

export interface PolygonOptions extends GraphicOptions {
	points: Point[];
	close?: boolean;
}

export class Polygon extends Graphic<PolygonOptions> {
	public override readonly type = "Polygon";

	public points: Point[];

	public close: boolean;

	constructor(options: PolygonOptions) {
		super(options);
		if (options.points.length < 2) throw new Error("Polygon must have at least two points");
		this.points = options.points;
		this.close = options.close ?? true;
	}

	public override getAabb(): Aabb {
		let minX = Number.MAX_VALUE;
		let minY = Number.MAX_VALUE;
		let maxX = Number.MIN_VALUE;
		let maxY = Number.MIN_VALUE;

		const points = this.points.slice();
		if (this.close) points.push(points[0]);

		for (const point of points) {
			const { x, y } = point;
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}

		const { x, y } = this.matrix.apply(new Point(minX, minY));
		const aabb = Aabb.zero()
			.offset(new Offset(x, y))
			.grow(new Offset(maxX - minX, maxY - minY));

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { close, style } = this;
		const points = this.points.map<Point>(vertex => this.toGlobalPoint(vertex));
		if (close) points.push(points[0]);

		canvas.drawPolygon(points, style);
	}

	public override hitTest(point: Point): this | undefined {
		const points = this.points.map<Point>(vertex => this.toGlobalPoint(vertex));
		if (this.close) points.push(points[0]);

		let inside = false;
		for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
			if (isIntersect(point, points[i], points[j])) {
				inside = !inside;
			}
		}

		return inside ? this : undefined;
	}
}

// 线性插值
// y = y0 + (x − x0) * ((y1 − y0) / (x1 − x0)​)
/**
 * 检测点向右的射线是否与线段相交，
 * 可以理解为检测点是否在线段的左边
 */
function isIntersect(point: Point, p1: Point, p2: Point): boolean {
	// 判断坐标点Y 是否在线段的Y区间
	if (!(p1.y > point.y !== p2.y > point.y)) return false;
	const value = ((p2.x - p1.x) * (point.y - p1.y)) / (p2.y - p1.y) + p1.x;
	return point.x < value;
}
