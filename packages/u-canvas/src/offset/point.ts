import { Offset } from "./offset";

export class Point {
	public static origin(): Point {
		return new Point(0, 0);
	}

	public static fromXY(options: { x: number; y: number }): Point {
		return new Point(options.x, options.y);
	}

	constructor(
		public x: number,
		public y: number
	) {}

	public offset(offset: Offset): Point {
		return new Point(this.x + offset.dx, this.y + offset.dy);
	}

	public add(point: Point): Point {
		return new Point(this.x + point.x, this.y + point.y);
	}

	public subtract(point: Point): Point {
		return new Point(this.x - point.x, this.y - point.y);
	}

	public multiply(value: number): Point {
		return new Point(this.x * value, this.y * value);
	}

	public divide(value: number): Point {
		return new Point(this.x / value, this.y / value);
	}
}

export class Line {
	constructor(
		public start: Point,
		public end: Point
	) {}

	public offset(offset: Offset): Line {
		return new Line(this.start.offset(offset), this.end.offset(offset));
	}

	public add(point: Point): Line {
		return new Line(this.start.add(point), this.end.add(point));
	}

	public subtract(point: Point): Line {
		return new Line(this.start.subtract(point), this.end.subtract(point));
	}
}
