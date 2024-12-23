import type { GraphicOptions } from "../graphic";
import type { Point } from "../../types";
import type { Offset } from "../../offset";
import type { Canvas } from "../../renderer";
import { Graphic } from "../graphic";

export interface CircleOptions extends GraphicOptions {
	cx: number;
	cy: number;
	radius: number;
}

export class Circle extends Graphic<CircleOptions> {
	public override readonly type = "Circle";

	public cx: number;

	public cy: number;

	public radius: number;

	constructor(options: CircleOptions) {
		super(options);
		this.cx = options.cx;
		this.cy = options.cy;
		this.radius = options.radius;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		const { radius, style } = this;
		const [cx, cy] = [this.cx + offset.dx, this.cy + offset.dy];
		canvas.drawCircle(cx, cy, radius, style);
	}

	public override hitTest(point: Point): this | undefined {
		const [x, y] = point;
		const { cx, cy, radius } = this;

		if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(radius, 2)) return this;

		return undefined;
	}
}
