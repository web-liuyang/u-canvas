import type { GraphicOptions } from "./graphic";
import type { Point } from "../../types";
import type { Canvas } from "../../renderer";
import { Offset } from "../../offset";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

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

	public override getAabb(): Aabb {
		const [x, y] = this.matrix.apply(this.cx / 2, this.cy / 2);
		const aabb = Aabb.zero()
			.offset(new Offset(x, y))
			.grow([this.radius * 2, this.radius * 2]);

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { radius, style } = this;
		const [cx, cy] = this.toGlobalPoint([this.cx, this.cy]);
		canvas.drawCircle(cx, cy, radius, style);
	}

	public override hitTest(point: Point): this | undefined {
		const [x, y] = point;
		const { radius } = this;

		const [cx, cy] = this.toGlobalPoint([this.cx, this.cy]);

		if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(radius, 2)) return this;

		return undefined;
	}
}
