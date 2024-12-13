import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Point } from "../../types";
import { Offset, Paint } from "../..";

export interface RectangleOptions extends GraphicOptions {
	x: number;
	y: number;
	w: number;
	h: number;
	radii: number;
}

export interface RectangleFromCenterOptions extends GraphicOptions {
	x: number;
	y: number;
	w: number;
	h: number;
	radii: number;
}

export class Rectangle extends Graphic<RectangleOptions> {
	public override readonly type = "Rectangle";

	public x: number;

	public y: number;

	public w: number;

	public h: number;

	public radii: number;

	public get cx(): number {
		return this.x + this.w / 2;
	}

	public get cy(): number {
		return this.y + this.h / 2;
	}

	public static fromCenter(options: RectangleFromCenterOptions): Rectangle {
		const { x, y, w, h, radii, style } = options;
		return new Rectangle({
			id: options.id,
			x: x - w / 2,
			y: y - h / 2,
			w: w,
			h: h,
			radii: radii,
			style: style,
		});
	}

	constructor(options: RectangleOptions) {
		super(options);
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
		this.radii = options.radii;
	}

	public override paint(paint: Paint, offset: Offset): void {
		// const path = new Path2D();
		const { style, radii } = this;
		const [x, y] = [this.x + offset.dx, this.y + offset.dy];
		const [w, h] = [this.w, this.h];
		paint.rect(x, y, w, h, radii, style);

		// paint.stroke(path);
		// paint.fill(path);
	}

	public override copyWith(options: CopyWithParameter<RectangleOptions>): Rectangle {
		return new Rectangle({
			id: this.id,
			x: options.x ?? this.x,
			y: options.y ?? this.y,
			w: options.w ?? this.w,
			h: options.h ?? this.h,
			radii: options.radii ?? this.radii,
			style: options.style ?? this.style,
		});
	}

	public override hitTest(point: Point): boolean {
		// TODO 没有判断圆角
		const [x, y] = point;
		const { x: leftTopX, y: leftTopY, w, h } = this;
		const rightBottomX = leftTopX + w;
		const rightBottomY = leftTopY + h;

		if (x >= leftTopX && x <= rightBottomX && y >= leftTopY && y <= rightBottomY) return true;

		return false;
	}

	public override equals(other: Rectangle): boolean {
		return (
			super.equals(other) &&
			this.x === other.x &&
			this.y === other.y &&
			this.w === other.w &&
			this.h === other.h &&
			this.radii === other.radii
		);
	}
}
