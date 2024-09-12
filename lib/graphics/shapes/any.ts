import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Rectangle } from "./rectangle";
import { Point } from "../../types";

export interface AnyOptions extends GraphicOptions {
	points: Point[];
}

export class Any extends Graphic<AnyOptions> {
	public override readonly type = "Any";

	public readonly points: AnyOptions["points"];

	constructor(options: AnyOptions) {
		super(options);
		this.points = options.points;
	}

	public override paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const path = new Path2D();

			for (const vertex of this.points) {
				const [x, y] = vertex;
				path.lineTo(x, y);
			}

			ctx.stroke(path);
			ctx.fill(path);
		});
	}

	public override copyWith(options: CopyWithParameter<AnyOptions>): Any {
		return new Any({
			id: this.id,
			points: options.points ?? this.points,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}

	public override hitTest(point: Point): boolean {
		for (const [x, y] of this.points) {
			const rect = Rectangle.fromCenter({
				id: "hit",
				x,
				y,
				w: 10,
				h: 10,
				// selected: false,
			});

			if (rect.hitTest(point)) return true;
		}

		return false;
	}

	// public towingPointPaint(ctx: CanvasRenderingContext2D): void {
	// 	const size = 10;
	// 	const points = [...this.points];
	// 	const [fx, fy] = points.shift()!;
	// 	let minX = fx;
	// 	let minY = fy;
	// 	let maxX = fx;
	// 	let maxY = fy;

	// 	for (const point of this.points) {
	// 		const [x, y] = point;
	// 		if (x < minX) minX = x;
	// 		if (y < minY) minY = y;
	// 		if (x > maxX) maxX = x;
	// 		if (y > maxY) maxY = y;
	// 	}

	// 	const leftTop = Rectangle.fromCenter({
	// 		id: "leftTop",
	// 		x: minX,
	// 		y: minY,
	// 		width: size,
	// 		height: size,
	// 		selected: false,
	// 	});

	// 	const leftBottom = Rectangle.fromCenter({
	// 		id: "leftBottom",
	// 		x: minX,
	// 		y: maxY,
	// 		width: size,
	// 		height: size,
	// 		selected: false,
	// 	});

	// 	const rightTop = Rectangle.fromCenter({
	// 		id: "rightTop",
	// 		x: maxX,
	// 		y: minY,
	// 		width: size,
	// 		height: size,
	// 		selected: false,
	// 	});

	// 	const rightBottom = Rectangle.fromCenter({
	// 		id: "rightBottom",
	// 		x: maxX,
	// 		y: maxY,
	// 		width: size,
	// 		height: size,
	// 		selected: false,
	// 	});

	// 	leftTop.paint(ctx);
	// 	leftBottom.paint(ctx);
	// 	rightTop.paint(ctx);
	// 	rightBottom.paint(ctx);
	// }

	public override equals(other: Any): boolean {
		return (
			super.equals(other) &&
			this.points.length === other.points.length &&
			this.points.every((point, index) => point[0] === other.points[index][0] && point[1] === other.points[index][1])
		);
	}
}
