import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Rectangle } from "./rectangle";
import { Point } from "../../types";
import { Offset, Paint } from "../..";

export interface AnyOptions extends GraphicOptions {
	points: Point[];
}

export class Any extends Graphic<AnyOptions> {
	public override readonly type = "Any";

	public points: AnyOptions["points"];

	constructor(options: AnyOptions) {
		super(options);
		this.points = options.points;
	}

	public override paint(paint: Paint, offset: Offset): void {
		const path = new Path2D();
		for (const vertex of this.points) {
			const [x, y] = [vertex[0] + offset.dx, vertex[1] + offset.dy];
			paint.lineTo(x, y);
		}

		paint.stroke(path);
		paint.fill(path);
	}

	public override copyWith(options: CopyWithParameter<AnyOptions>): Any {
		return new Any({
			id: this.id,
			points: options.points ?? this.points,
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
			});

			if (rect.hitTest(point)) return true;
		}

		return false;
	}

	public override equals(other: Any): boolean {
		return (
			super.equals(other) &&
			this.points.length === other.points.length &&
			this.points.every((point, index) => point[0] === other.points[index][0] && point[1] === other.points[index][1])
		);
	}
}
