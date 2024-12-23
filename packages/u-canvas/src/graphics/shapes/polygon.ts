import type { GraphicOptions } from "../graphic";
import type { Point } from "../../types";
import type { Offset } from "../../offset";
import type { Canvas } from "../../renderer";
import { Graphic } from "../graphic";
import { isPointOnLineSegment } from "../utils";

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

	public override paint(canvas: Canvas, offset: Offset): void {
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
		// 这个要重新计算，这里是错误的，是polyline的算法
		let currentPoint = this.points[0];
		for (let i = 1; i < this.points.length; i++) {
			const isOnSegment = isPointOnLineSegment(point, [currentPoint, this.points[i]]);
			if (isOnSegment) return this;
			currentPoint = this.points[i];
		}

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
