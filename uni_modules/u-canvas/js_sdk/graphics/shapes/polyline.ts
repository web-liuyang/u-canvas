import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Line, Offset, Point } from "../../coords";
import { Graphic } from "./graphic";
import { isPointOnLineSegment } from "../utils";
import { Aabb } from "../aabb";

export interface PolylineOptions extends GraphicOptions {
	points: Point[];
}

export class Polyline extends Graphic<PolylineOptions> {
	public override readonly type = "Polyline";

	/**
	 * 点集合
	 */
	public points: Point[];

	constructor(options: PolylineOptions) {
		super(options);
		if (options.points.length < 2) throw new Error("Polyline must have at least two points");
		this.points = options.points;
	}

	public override getAabb(): Aabb {
		let minX = Number.MAX_VALUE;
		let minY = Number.MAX_VALUE;
		let maxX = Number.MIN_VALUE;
		let maxY = Number.MIN_VALUE;

		const points = this.points.slice();

		for (const point of points) {
			const { x, y } = point;
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}

		const { x, y } = this.matrix.apply(new Point(minX, minY));
		const aabb = Aabb.zero()
			.offseted(new Offset(x, y))
			.grew(new Offset(maxX - minX, maxY - minY));

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { style } = this;
		const points = this.points.map<Point>(vertex => this.toGlobalPoint(vertex));
		canvas.drawPolyline(points, style);
	}

	public override hitTest(point: Point): this | undefined {
		let currentPoint = this.points[0];
		for (let i = 1; i < this.points.length; i++) {
			const isOnSegment = isPointOnLineSegment(
				point,
				new Line(this.toGlobalPoint(currentPoint), this.toGlobalPoint(this.points[i]))
			);
			if (isOnSegment) return this;
			currentPoint = this.points[i];
		}

		return undefined;
	}
}
