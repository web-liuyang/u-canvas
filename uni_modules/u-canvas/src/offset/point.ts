import { PointBase } from "./point-base";
import { OffsetBase } from "./offset-base";
import { Offset } from "./offset";

export class Point extends PointBase {
	public static origin(): Point {
		return new Point(0, 0);
	}

	public static fromXY(options: PointBase): Point {
		return new Point(options.x, options.y);
	}

	constructor(x: number, y: number) {
		super(x, y);
	}

	public offset(offset: OffsetBase): Point {
		return new Point(this.x + offset.dx, this.y + offset.dy);
	}

	public add(point: PointBase): Point {
		return new Point(this.x + point.x, this.y + point.y);
	}

	public subtract(point: PointBase): Point {
		return new Point(this.x - point.x, this.y - point.y);
	}

	public multiply(value: number): Point {
		return new Point(this.x * value, this.y * value);
	}

	public divide(value: number): Point {
		return new Point(this.x / value, this.y / value);
	}

	public toOffset(): Offset {
		return new Offset(this.x, this.y);
	}
}
