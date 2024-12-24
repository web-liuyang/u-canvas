import { Offset } from "../offset";
import { Point, Size } from "../types";

export class Aabb {
	public static zero(): Aabb {
		return new Aabb([0, 0], [0, 0]);
	}

	public static world(): Aabb {
		return new Aabb([Number.MIN_VALUE, Number.MIN_VALUE], [Number.MAX_VALUE, Number.MAX_VALUE]);
	}

	public min: Point;

	public max: Point;

	get width(): number {
		return this.max[0] - this.min[0];
	}

	get height(): number {
		return this.max[1] - this.min[1];
	}

	constructor(min: Point, max: Point) {
		this.min = min;
		this.max = max;
	}

	public offset(offset: Offset): Aabb {
		return new Aabb(
			[this.min[0] + offset.dx, this.min[1] + offset.dy],
			[this.max[0] + offset.dx, this.max[1] + offset.dy]
		);
	}

	public grow(size: Size): Aabb {
		return new Aabb([this.min[0], this.min[1]], [this.max[0] + size[0], this.max[1] + size[1]]);
	}
}
