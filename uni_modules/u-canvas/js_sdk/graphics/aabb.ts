import { Offset, Point } from "../coords";

/**
 * 轴对齐包围盒
 */
export class Aabb {
	/**
	 * 零点
	 * @returns
	 */
	public static zero(): Aabb {
		return new Aabb(Point.origin(), Point.origin());
	}

	/**
	 * 世界大小
	 * @returns
	 */
	public static world(): Aabb {
		return new Aabb(new Point(Number.MIN_VALUE, Number.MIN_VALUE), new Point(Number.MAX_VALUE, Number.MAX_VALUE));
	}

	/**
	 * 最小坐标点
	 */
	public min: Point;

	/**
	 * 最大坐标点
	 */
	public max: Point;

	/**
	 * 宽度
	 */
	get width(): number {
		return this.max.x - this.min.x;
	}

	/**
	 * 高度
	 */
	get height(): number {
		return this.max.y - this.min.y;
	}

	constructor(min: Point, max: Point) {
		this.min = min;
		this.max = max;
	}

	/**
	 * 是否包含坐标点
	 * @param point 坐标点
	 * @returns
	 */
	public contains(point: Point): boolean {
		return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
	}

	/**
	 * 成长
	 * @param offset 偏移量
	 * @returns
	 */
	public grew(offset: Offset): Aabb {
		return new Aabb(this.min, this.max.offseted(offset));
	}

	/**
	 * 偏移量坐标
	 * @param offset 偏移量
	 * @returns
	 */
	public offseted(offset: Offset): Aabb {
		return new Aabb(this.min.offseted(offset), this.max.offseted(offset));
	}

	/**
	 * 最大坐标点与最小坐标点交换
	 * @returns
	 */
	public swapped(): Aabb {
		return new Aabb(this.max, this.min);
	}
}
