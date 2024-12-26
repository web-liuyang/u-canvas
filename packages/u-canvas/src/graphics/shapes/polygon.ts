import type { GraphicOptions } from "./graphic";
import type { Point } from "../../types";
import type { Canvas } from "../../renderer";
import { Offset } from "../../offset";
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
			const [x, y] = point;
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}

		const [x, y] = this.matrix.apply(minX, minY);
		const aabb = Aabb.zero()
			.offset(new Offset(x, y))
			.grow([maxX - minX, maxY - minY]);

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { close, style } = this;
		const points = this.points.map<Point>(vertex => [vertex[0] + offset.dx, vertex[1] + offset.dy]);
		if (close) points.push(points[0]);

		canvas.drawPolygon(points, style);
	}

	// public override copyWith(options: CopyWithParameter<PolygonOptions>): Polygon {
	// 	return new Polygon({
	// 		id: this.id,
	// 		points: options.points ?? this.points,
	// 		// selected: options.selected ?? this.selected,
	// 		// editing: options.editing ?? this.editing,
	// 		close: options.close ?? this.close,
	// 		style: options.style ?? this.style,
	// 	});
	// }

	public override hitTest(point: Point): this | undefined {
		const points = this.points.slice();
		if (this.close) points.push(points[0]);

		const [x, y] = point;
		let isInside = false;
		// 多边形边界检测
		for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
			const [vix, viy] = points[i];
			const [vjx, vjy] = points[j];

			if (viy > y !== vjy > y && x < ((vjx - vix) * (y - viy)) / (vjy - viy) + vix) {
				isInside = !isInside;
			}
		}

		if (isInside) this;

		return undefined;
	}

	// public override equals(other: Polygon): boolean {
	// 	return (
	// 		super.equals(other) &&
	// 		this.close === other.close &&
	// 		this.points.length === other.points.length &&
	// 		this.points.every((point, index) => point[0] === other.points[index][0] && point[1] === other.points[index][1])
	// 	);
	// }
}
