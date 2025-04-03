import { PointBase } from "./point-base";
import { OffsetBase } from "./offset-base";
import { Offset } from "./offset";

export class Point extends PointBase {
	/**
	 * 创建原点坐标点
	 * @returns
	 */
	public static origin(): Point {
		return new Point(0, 0);
	}

	/**
	 * 根据 x 与 y 创建坐标点
	 * @returns
	 */
	public static fromXY(xy: PointBase): Point {
		return new Point(xy.x, xy.y);
	}

	constructor(x: number, y: number) {
		super(x, y);
	}

	/**
	 * 偏移
	 * @param offset 偏移量
	 * @returns
	 */
	public offseted(offset: OffsetBase): Point {
		return new Point(this.x + offset.dx, this.y + offset.dy);
	}

	/**
	 * 加上坐标点
	 * @param point 坐标点
	 * @returns
	 */
	public added(point: PointBase): Point {
		return new Point(this.x + point.x, this.y + point.y);
	}

	/**
	 * 减去坐标点
	 * @param point 坐标点
	 * @returns
	 */
	public subtracted(point: PointBase): Point {
		return new Point(this.x - point.x, this.y - point.y);
	}

	/**
	 * 缩放
	 * @param x x 倍率
	 * @param y y 倍率
	 * @returns
	 */
	public scaled(sx: number, sy: number): Point {
		return new Point(this.x * sx, this.y * sy);
	}

	/**
	 * 转换为 Offset
	 * @returns
	 */
	public toOffset(): Offset {
		return new Offset(this.x, this.y);
	}
}
