import type { CopyWithParameter, GraphicOptions } from "./graphic";
import { Graphic } from "./graphic";

export interface CircleOptions extends GraphicOptions {
	center: Point;
	radius: number;
}

export class Circle extends Graphic<CircleOptions> {
	public override readonly type = "Circle";

	public readonly radius: number;

	public readonly center: Point;

	constructor(options: CircleOptions) {
		super(options);
		this.radius = options.radius;
		this.center = options.center;
	}

	public paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const [x, y] = this.center;
			const radius = this.radius;
			const path = new Path2D();
			path.arc(x, y, radius, 0, 2 * Math.PI);
			ctx.stroke(path);
			ctx.fill(path);
		});
	}

	public copyWith(options: CopyWithParameter<CircleOptions>): Circle {
		return new Circle({
			id: this.id,
			center: options.center ?? this.center,
			radius: options.radius ?? this.radius,
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
		} = this;

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
		return (
			super.equals(other) &&
			this.center[0] === other.center[0] &&
			this.center[1] === other.center[1] &&
			this.radius === other.radius
		);
	}
}
