import { Offset, Point } from "../offset";

export class Aabb {
	public static zero(): Aabb {
		return new Aabb(Point.origin(), Point.origin());
	}

	public static world(): Aabb {
		return new Aabb(new Point(Number.MIN_VALUE, Number.MIN_VALUE), new Point(Number.MAX_VALUE, Number.MAX_VALUE));
	}

	public min: Point;

	public max: Point;

	get width(): number {
		return this.max.x - this.min.x;
	}

	get height(): number {
		return this.max.y - this.min.y;
	}

	constructor(min: Point, max: Point) {
		this.min = min;
		this.max = max;
	}

	public offset(offset: Offset): Aabb {
		return new Aabb(this.min.offset(offset), this.max.offset(offset));
	}

	public grow(offset: Offset): Aabb {
		return new Aabb(this.min, this.max.offset(offset));
	}

	public swap(): Aabb {
		return new Aabb(this.max, this.min);
	}

	public contains(point: Point): boolean {
		return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
	}
}
