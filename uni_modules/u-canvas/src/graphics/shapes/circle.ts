import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset, Point } from "../../offset";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

export interface CircleOptions extends GraphicOptions {
	cx: number;
	cy: number;
	radius: number;
}

export class Circle extends Graphic<CircleOptions> {
	public override readonly type = "Circle";

	/**
	 * 圆心 x 坐标
	 */
	public cx: number;

	/**
	 * 圆心 y 坐标
	 */
	public cy: number;

	/**
	 * 半径
	 */
	public radius: number;

	constructor(options: CircleOptions) {
		super(options);
		this.cx = options.cx;
		this.cy = options.cy;
		this.radius = options.radius;
	}

	public override getAabb(): Aabb {
		const { x, y } = this.matrix.apply(new Point(0, 0));
		const aabb = Aabb.zero()
			.offset(new Offset(x, y))
			.grow(new Offset(this.radius * 2, this.radius * 2));

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { radius, style } = this;
		const { x: cx, y: cy } = this.toGlobalPoint(new Point(this.cx, this.cy));
		canvas.drawCircle(cx, cy, radius, style);
	}

	public override hitTest(point: Point): this | undefined {
		const { radius } = this;
		const { x: cx, y: cy } = this.toGlobalPoint(new Point(this.cx, this.cy));

		if (Math.pow(point.x - cx, 2) + Math.pow(point.y - cy, 2) <= Math.pow(radius, 2)) return this;

		return undefined;
	}
}
