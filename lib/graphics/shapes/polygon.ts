import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { isPointOnLineSegment } from "../utils";

export interface LineOptions extends GraphicOptions {
	points: Point[];
}

export class Polygon extends Graphic<LineOptions> {
	public override readonly type = "Polygon";

	public readonly points: LineOptions["points"];

	constructor(options: LineOptions) {
		super(options);
		if (options.points.length < 2) throw new Error("Polygon must have at least two points");
		this.points = options.points;
	}

	public override paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const path = new Path2D();
			for (const vertex of this.points) {
				const [x, y] = vertex;
				path.lineTo(x, y);
			}
			path.closePath();

			ctx.stroke(path);
			ctx.fill(path);
		});
	}

	public override copyWith(options: CopyWithParameter<LineOptions>): Polygon {
		return new Polygon({
			id: this.id,
			points: options.points ?? this.points,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}

	public override hitTest(point: Point): boolean {
		let currentPoint = this.points[0];
		for (let i = 1; i < this.points.length; i++) {
			const isOnSegment = isPointOnLineSegment(point, [currentPoint, this.points[i]]);
			if (isOnSegment) return true;
			currentPoint = this.points[i];
		}

		return false;
	}

	public override equals(other: Polygon): boolean {
		return (
			super.equals(other) &&
			this.points.length === other.points.length &&
			this.points.every((point, index) => point[0] === other.points[index][0] && point[1] === other.points[index][1])
		);
	}
}
