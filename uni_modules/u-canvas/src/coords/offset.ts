import { OffsetBase } from "./offset-base";
import { Point } from "./point";

export class Offset extends OffsetBase {
	/**
	 * 根据方向与距离创建 Offset
	 * @param direction 方向弧度
	 * @param distance 距离
	 * @returns
	 */
	public static fromDirection(direction: number, distance: number = 1.0): Offset {
		return new Offset(distance * Math.cos(direction), distance * Math.sin(direction));
	}

	/**
	 * 创建 0 偏移量的 Offset
	 * @returns
	 */
	public static zero(): Offset {
		return new Offset(0.0, 0.0);
	}

	/**
	 * 距离
	 */
	public get distance(): number {
		const { dx, dy } = this;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * 方向弧度
	 */
	public get direction(): number {
		const { dx, dy } = this;
		return Math.atan2(dy, dx);
	}

	constructor(dx: number, dy: number) {
		super(dx, dy);
	}

	/**
	 * 偏移
	 * @param offset 偏移量
	 * @returns
	 */
	public offseted(offset: OffsetBase): Offset {
		const { dx, dy } = this;
		return new Offset(dx + offset.dx, dy + offset.dy);
	}

	/**
	 * 缩放
	 * @param x x 倍率
	 * @param y y 倍率
	 * @returns
	 */
	public scaled(sx: number, sy: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx * sx, dy * sy);
	}

	/**
	 * 平移
	 * @param tx x 偏移量
	 * @param ty y 偏移量
	 * @returns
	 */
	public translated(tx: number, ty: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx + tx, dy + ty);
	}

	/**
	 * 镜像偏移量
	 * @returns
	 */
	public mirrored(): Offset {
		const { dx, dy } = this;
		return new Offset(-dx, -dy);
	}

	/**
	 * 转换为 Point
	 * @returns
	 */
	public toPoint(): Point {
		const { dx, dy } = this;
		return new Point(dx, dy);
	}
}
