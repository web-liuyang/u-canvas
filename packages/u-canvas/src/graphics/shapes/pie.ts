import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset, Point } from "../../offset";
import { Graphic } from "./graphic";
import { Path } from "../../renderer";
import { Aabb } from "../aabb";

export interface PieOptions extends GraphicOptions {
	cx: number;
	cy: number;
	radius: number;
	startAngle: number;
	endAngle: number;
	counterclockwise?: boolean;
}

export class Pie extends Graphic<PieOptions> {
	public override readonly type = "Pie";

	public cx: number;

	public cy: number;

	public radius: number;

	public startAngle: number;

	public endAngle: number;

	public counterclockwise: boolean;

	constructor(options: PieOptions) {
		super(options);
		this.cx = options.cx;
		this.cy = options.cy;
		this.radius = options.radius;
		this.startAngle = options.startAngle;
		this.endAngle = options.endAngle;
		this.counterclockwise = options.counterclockwise ?? false;
	}

	public override getAabb(): Aabb {
		const { x, y } = this.matrix.apply(new Point(this.cx / 2, this.cy / 2));
		const aabb = Aabb.zero()
			.offset(new Offset(x, y))
			.grow(new Offset(this.radius * 2, this.radius * 2));

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { radius, startAngle, endAngle, counterclockwise, style } = this;
		const { x: cx, y: cy } = this.toGlobalPoint(new Point(this.cx, this.cy));

		const path = new Path();
		path.moveTo(cx, cy);
		path.arc(cx, cy, radius, startAngle, endAngle, counterclockwise);
		path.closePath();
		canvas.drawPath(path, style);
	}

	// public override copyWith(options: CopyWithParameter<PieOptions>): Pie {
	// 	return new Pie({
	// 		id: this.id,
	// 		cx: options.cx ?? this.cx,
	// 		cy: options.cy ?? this.cy,
	// 		radius: options.radius ?? this.radius,
	// 		startAngle: options.startAngle ?? this.startAngle,
	// 		endAngle: options.endAngle ?? this.endAngle,
	// 		// selected: options.selected ?? this.selected,
	// 		// editing: options.editing ?? this.editing,
	// 		style: options.style ?? this.style,
	// 	});
	// }

	public override hitTest(point: Point): this | undefined {
		const { radius, startAngle, endAngle } = this;
		const { x: dx, y: dy } = point.subtract(this.toGlobalPoint(new Point(this.cx, this.cy)));
		const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		if (distance <= radius) {
			let angle = Math.atan2(dy, dx);
			// Adjust the angle to be between 0 and 2π
			if (angle < 0) angle += 2 * Math.PI;
			if (angle >= startAngle && angle <= endAngle) return this;
		}

		return undefined;
	}

	// public override equals(other: Pie): boolean {
	// 	return (
	// 		super.equals(other) &&
	// 		this.cx === other.cx &&
	// 		this.cy === other.cy &&
	// 		this.radius === other.radius &&
	// 		this.startAngle === other.startAngle &&
	// 		this.endAngle === other.endAngle
	// 	);
	// }
}
