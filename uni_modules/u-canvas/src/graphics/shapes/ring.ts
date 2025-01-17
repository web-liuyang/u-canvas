import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset, Point } from "../../offset";
import { Graphic } from "./graphic";
import { Path } from "../../renderer";
import { Aabb } from "../aabb";

export interface RingOptions extends GraphicOptions {
	cx: number;
	cy: number;
	innerRadius: number;
	outerRadius: number;
	startAngle: number;
	endAngle: number;
	counterclockwise?: boolean;
}

export class Ring extends Graphic<RingOptions> {
	public override readonly type = "Ring";

	public cx: number;

	public cy: number;

	public innerRadius: number;

	public outerRadius: number;

	public startAngle: number;

	public endAngle: number;

	public counterclockwise: boolean;

	constructor(options: RingOptions) {
		super(options);
		this.cx = options.cx;
		this.cy = options.cy;
		this.innerRadius = options.innerRadius;
		this.outerRadius = options.outerRadius;
		this.startAngle = options.startAngle;
		this.endAngle = options.endAngle;
		this.counterclockwise = options.counterclockwise ?? false;
	}

	public override getAabb(): Aabb {
		const { x, y } = this.matrix.apply(new Point(this.cx / 2, this.cy / 2));
		const aabb = Aabb.zero()
			.offset(new Offset(x, y))
			.grow(new Offset(this.outerRadius * 2, this.outerRadius * 2));

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { x: cx, y: cy } = this.toGlobalPoint(new Point(this.cx, this.cy));
		const { innerRadius, outerRadius, startAngle, endAngle, counterclockwise, style } = this;
		const path = new Path();

		path.arc(cx, cy, outerRadius, startAngle, endAngle, counterclockwise);
		path.arc(cx, cy, innerRadius, endAngle, startAngle, !counterclockwise);
		path.closePath();

		canvas.drawPath(path, style);
	}

	public override hitTest(point: Point): this | undefined {
		const { innerRadius, outerRadius, startAngle, endAngle } = this;
		const { x: dx, y: dy } = point.subtract(this.toGlobalPoint(new Point(this.cx, this.cy)));
		const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		if (distance >= innerRadius && distance <= outerRadius) {
			let angle = Math.atan2(dy, dx);
			// Adjust the angle to be between 0 and 2π
			if (angle < 0) angle += 2 * Math.PI;
			if (angle >= startAngle && angle <= endAngle) return this;
		}

		return undefined;
	}
}
