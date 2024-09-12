import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";

export interface RectangleOptions extends GraphicOptions {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface RectangleFromCenterOptions extends GraphicOptions {
	x: number;
	y: number;
	w: number;
	h: number;
}

export class Rectangle extends Graphic<RectangleOptions> {
	public override readonly type = "Rectangle";

	public readonly x: number;

	public readonly y: number;

	public readonly w: number;

	public readonly h: number;

	public get cx(): number {
		return this.x + this.w / 2;
	}

	public get cy(): number {
		return this.y + this.h / 2;
	}

	public static fromCenter(options: RectangleFromCenterOptions): Rectangle {
		const { x, y, w, h } = options;
		return new Rectangle({
			id: options.id,
			x: x - w / 2,
			y: y - h / 2,
			w: w,
			h: h,
			// selected: options.selected,
			// editing: options.editing,
			style: options.style,
		});
	}

	constructor(options: RectangleOptions) {
		super(options);
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
	}

	public override paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const { x, y, w, h } = this;
			const path = new Path2D();
			path.rect(x, y, w, h);
			ctx.stroke(path);
			ctx.fill(path);
		});
	}

	public override copyWith(options: CopyWithParameter<RectangleOptions>): Rectangle {
		return new Rectangle({
			id: this.id,
			x: options.x ?? this.x,
			y: options.y ?? this.y,
			w: options.w ?? this.w,
			h: options.h ?? this.h,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}

	public override hitTest(point: Point): boolean {
		const [x, y] = point;
		const { x: leftTopX, y: leftTopY, w, h } = this;
		const rightBottomX = leftTopX + w;
		const rightBottomY = leftTopY + h;

		if (x >= leftTopX && x <= rightBottomX && y >= leftTopY && y <= rightBottomY) return true;

		return false;
	}

	public override equals(other: Rectangle): boolean {
		return super.equals(other) && this.x === other.x && this.y === other.y && this.w === other.w && this.h === other.h;
	}
}
