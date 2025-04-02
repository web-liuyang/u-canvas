import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset, Point } from "../../coords";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

export interface RectangleOptions extends GraphicOptions {
	x: number;
	y: number;
	w: number;
	h: number;
	radii?: number;
}

export interface RectangleFromCenterOptions extends GraphicOptions {
	cx: number;
	cy: number;
	w: number;
	h: number;
	radii?: number;
}

export class Rectangle extends Graphic<RectangleOptions> {
	public override readonly type = "Rectangle";

	/**
	 * 基点 x 坐标
	 */
	public x: number;

	/**
	 * 基点 y 坐标
	 */
	public y: number;

	/**
	 * 宽度
	 */
	public w: number;

	/**
	 * 高度
	 */
	public h: number;

	/**
	 * 圆角
	 */
	public radii: number;

	/**
	 * 中心点 x 坐标
	 */
	public get cx(): number {
		return this.x + this.w / 2;
	}

	/**
	 * 中心点 y 坐标
	 */
	public get cy(): number {
		return this.y + this.h / 2;
	}

	/**
	 * 通过中心点创建
	 * @param options
	 * @returns
	 */
	public static fromCenter(options: RectangleFromCenterOptions): Rectangle {
		const { cx, cy, w, h, radii, style } = options;
		return new Rectangle({
			id: options.id,
			x: cx - w / 2,
			y: cy - h / 2,
			w: w,
			h: h,
			radii: radii,
			style: style,
		});
	}

	constructor(options: RectangleOptions) {
		super(options);
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
		this.radii = options.radii ?? 0;
	}

	public override getAabb(): Aabb {
		const { x, y } = this.matrix.apply(new Point(this.x, this.y));
		const aabb = Aabb.zero().offseted(new Offset(x, y)).grew(new Offset(this.w, this.h));

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { style, radii } = this;
		const { x, y } = this.toGlobalPoint(new Point(this.x, this.y));
		const [w, h] = [this.w, this.h];
		canvas.drawRect(x, y, w, h, radii, style);
	}

	public override hitTest(point: Point): this | undefined {
		const { w, h, radii } = this;
		const { x: leftTopX, y: leftTopY } = this.toGlobalPoint(new Point(this.x, this.y));
		const rightBottomX = leftTopX + w;
		const rightBottomY = leftTopY + h;

		if (point.x >= leftTopX && point.x <= rightBottomX && point.y >= leftTopY && point.y <= rightBottomY) return this;

		if (point.x >= leftTopX && point.x <= leftTopX + w && point.y >= leftTopY && point.y <= leftTopY + h) {
			return this; // 点在矩形内部
			// 检查点是否在圆角矩形的圆角区域内
		} else if (
			(point.x >= leftTopX && point.x <= leftTopX + radii && point.y >= leftTopY && point.y <= leftTopY + radii) ||
			(point.x >= leftTopX + w - radii &&
				point.x <= leftTopX + w &&
				point.y >= leftTopY &&
				point.y <= leftTopY + radii) ||
			(point.x >= leftTopX &&
				point.x <= leftTopX + radii &&
				point.y >= leftTopY + h - radii &&
				point.y <= leftTopY + h) ||
			(point.x >= leftTopX + w - radii &&
				point.x <= leftTopX + w &&
				point.y >= leftTopY + h - radii &&
				point.y <= leftTopY + h)
		) {
			const res =
				Math.sqrt(Math.pow(point.x - (leftTopX + radii), 2) + Math.pow(point.y - (leftTopY + radii), 2)) <= radii ||
				Math.sqrt(Math.pow(point.x - (leftTopX + w - radii), 2) + Math.pow(point.y - (leftTopY + radii), 2)) <= radii ||
				Math.sqrt(Math.pow(point.x - (leftTopX + radii), 2) + Math.pow(point.y - (leftTopY + h - radii), 2)) <= radii ||
				Math.sqrt(Math.pow(point.x - (leftTopX + w - radii), 2) + Math.pow(point.y - (leftTopY + h - radii), 2)) <=
					radii;

			if (res) return this;
		}

		return;
	}
}
