import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Point } from "../../types";

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

	public override paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const { cx, cy, radius } = this;
			const path = new Path2D();
			path.arc(cx, cy, radius, 0, 2 * Math.PI);
			ctx.stroke(path);
			ctx.fill(path);
		});
	}

	public override copyWith(options: CopyWithParameter<CircleOptions>): Circle {
		return new Circle({
			id: this.id,
			cx: options.cx ?? this.cx,
			cy: options.cy ?? this.cy,
			radius: options.radius ?? this.radius,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}

	public override hitTest(point: Point): boolean {
		const [x, y] = point;
		const { cx, cy, radius } = this;

		if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(radius, 2)) return true;

		return false;
	}

	// public towingPointPaint(ctx: CanvasRenderingContext2D): void {
	//   const size = 10;
	//   const {
	//     center: [x, y],
	//     radius,
	//   } = this;

	//   const leftTop = Rectangle.fromCenter({
	//     id: "leftTop",
	//     x: x - radius,
	//     y: y - radius,
	//     width: size,
	//     height: size,
	//     selected: false,
	//   });

	//   const leftBottom = Rectangle.fromCenter({
	//     id: "leftBottom",
	//     x: x - radius,
	//     y: y + radius,
	//     width: size,
	//     height: size,
	//     selected: false,
	//   });

	//   const rightTop = Rectangle.fromCenter({
	//     id: "rightTop",
	//     x: x + radius,
	//     y: y - radius,
	//     width: size,
	//     height: size,
	//     selected: false,
	//   });

	//   const rightBottom = Rectangle.fromCenter({
	//     id: "rightBottom",
	//     x: x + radius,
	//     y: y + radius,
	//     width: size,
	//     height: size,
	//     selected: false,
	//   });

	//   leftTop.paint(ctx);
	//   leftBottom.paint(ctx);
	//   rightTop.paint(ctx);
	//   rightBottom.paint(ctx);
	// }

	public override equals(other: Circle): boolean {
		return super.equals(other) && this.cx === other.cx && this.cy === other.cy && this.radius === other.radius;
	}
}
