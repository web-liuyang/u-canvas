import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Point } from "../../types";

export interface RingOptions extends GraphicOptions {
	cx: number;
	cy: number;
	innerRadius: number;
	outerRadius: number;
	startAngle: number;
	endAngle: number;
}

export class Ring extends Graphic<RingOptions> {
	public override readonly type = "Ring";

	public cx: number;

	public cy: number;

	public innerRadius: number;

	public outerRadius: number;

	public startAngle: number;

	public endAngle: number;

	constructor(options: RingOptions) {
		super(options);
		this.cx = options.cx;
		this.cy = options.cy;
		this.innerRadius = options.innerRadius;
		this.outerRadius = options.outerRadius;
		this.startAngle = options.startAngle;
		this.endAngle = options.endAngle;
	}

	public override paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const { cx, cy } = this;
			const { innerRadius, outerRadius, startAngle, endAngle } = this;
			const path = new Path2D();

			path.arc(cx, cy, outerRadius, startAngle, endAngle);
			path.arc(cx, cy, innerRadius, endAngle, startAngle, true);
			path.closePath(); // 封闭路径

			ctx.fill(path);
			ctx.stroke(path);
		});
	}

	public override copyWith(options: CopyWithParameter<RingOptions>): Ring {
		return new Ring({
			id: this.id,
			cx: options.cx ?? this.cx,
			cy: options.cy ?? this.cy,
			innerRadius: options.innerRadius ?? this.innerRadius,
			outerRadius: options.outerRadius ?? this.outerRadius,
			startAngle: options.startAngle ?? this.startAngle,
			endAngle: options.endAngle ?? this.endAngle,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}

	public override hitTest(point: Point): boolean {
		const [x, y] = point;
		const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = this;

		const [dx, dy] = [x - cx, y - cy];
		const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		if (distance >= innerRadius && distance <= outerRadius) {
			let angle = Math.atan2(dy, dx);
			// Adjust the angle to be between 0 and 2π
			if (angle < 0) angle += 2 * Math.PI;
			if (angle >= startAngle && angle <= endAngle) return true;
		}

		return false;
	}

	public override equals(other: Ring): boolean {
		return (
			super.equals(other) &&
			this.cx === other.cx &&
			this.cy === other.cy &&
			this.innerRadius === other.innerRadius &&
			this.outerRadius === other.outerRadius &&
			this.startAngle === other.startAngle &&
			this.endAngle === other.endAngle
		);
	}
}
