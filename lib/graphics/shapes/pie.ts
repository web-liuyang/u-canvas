import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";

export interface PieOptions extends GraphicOptions {
	cx: number;
	cy: number;
	radius: number;
	startAngle: number;
	endAngle: number;
}

export class Pie extends Graphic<PieOptions> {
	public override readonly type = "Pie";

	public readonly cx: number;

	public readonly cy: number;

	public readonly radius: number;

	public readonly startAngle: number;

	public readonly endAngle: number;

	constructor(options: PieOptions) {
		super(options);
		this.cx = options.cx;
		this.cy = options.cy;
		this.radius = options.radius;
		this.startAngle = options.startAngle;
		this.endAngle = options.endAngle;
	}

	public override paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const { cx, cy, radius, startAngle, endAngle } = this;
			const path = new Path2D();
			path.moveTo(cx, cy);
			path.arc(cx, cy, radius, startAngle, endAngle);
			path.closePath();
			ctx.fill(path);
			ctx.stroke(path);
		});
	}

	public override copyWith(options: CopyWithParameter<PieOptions>): Pie {
		return new Pie({
			id: this.id,
			cx: options.cx ?? this.cx,
			cy: options.cy ?? this.cy,
			radius: options.radius ?? this.radius,
			startAngle: options.startAngle ?? this.startAngle,
			endAngle: options.endAngle ?? this.endAngle,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}

	public override hitTest(point: Point): boolean {
		const [x, y] = point;
		const { cx, cy, radius, startAngle, endAngle } = this;
		const [dx, dy] = [x - cx, y - cy];
		const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		if (distance <= radius) {
			let angle = Math.atan2(dy, dx);
			// Adjust the angle to be between 0 and 2π
			if (angle < 0) angle += 2 * Math.PI;
			if (angle >= startAngle && angle <= endAngle) return true;
		}

		return false;
	}

	public override equals(other: Pie): boolean {
		return (
			super.equals(other) &&
			this.cx === other.cx &&
			this.cy === other.cy &&
			this.radius === other.radius &&
			this.startAngle === other.startAngle &&
			this.endAngle === other.endAngle
		);
	}
}
