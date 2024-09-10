import type { CopyWithParameter, GraphicOptions } from "./graphic";
import { Graphic } from "./graphic";

export interface PieOptions extends GraphicOptions {
	center: Point;
	radius: number;
	startAngle: number;
	endAngle: number;
}

export class Pie extends Graphic<PieOptions> {
	public override readonly type = "Pie";

	public readonly radius: number;

	public readonly startAngle: number;

	public readonly endAngle: number;

	public readonly center: Point;

	constructor(options: PieOptions) {
		super(options);
		this.radius = options.radius;
		this.startAngle = options.startAngle;
		this.endAngle = options.endAngle;

		this.center = options.center;
	}

	public paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const [x, y] = this.center;
			const { radius, startAngle, endAngle } = this;
			const path = new Path2D();
			path.moveTo(x, y);
			path.arc(x, y, radius, startAngle, endAngle);
			path.closePath();
			ctx.fill(path);
			ctx.stroke(path);
		});
	}

	public copyWith(options: CopyWithParameter<PieOptions>): Pie {
		return new Pie({
			id: this.id,
			center: options.center ?? this.center,
			radius: options.radius ?? this.radius,
			startAngle: options.startAngle ?? this.startAngle,
			endAngle: options.endAngle ?? this.endAngle,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}

	public hit(point: Point): boolean {
		const [x, y] = point;
		const {
			center: [cx, cy],
			radius,
			startAngle,
			endAngle,
		} = this;

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
			this.center[0] === other.center[0] &&
			this.center[1] === other.center[1] &&
			this.radius === other.radius &&
			this.startAngle === other.startAngle &&
			this.endAngle === other.endAngle
		);
	}
}
