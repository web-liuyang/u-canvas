import type { Point } from "./point";
import type { PointBase } from "./point-base";
import type { OffsetBase } from "./offset-base";

export class Line {
	constructor(
		public start: Point,
		public end: Point
	) {}

	public offset(offset: OffsetBase): Line {
		return new Line(this.start.offset(offset), this.end.offset(offset));
	}

	public add(point: PointBase): Line {
		return new Line(this.start.add(point), this.end.add(point));
	}

	public subtract(point: PointBase): Line {
		return new Line(this.start.subtract(point), this.end.subtract(point));
	}
}
