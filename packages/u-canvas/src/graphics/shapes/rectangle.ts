import type { GraphicOptions } from "../graphic";
import type { Point } from "../../types";
import type { Canvas } from "../../renderer";
import { Offset } from "../../offset";
import { Graphic } from "../graphic";
import { Aabb } from "../aabb";

export interface RectangleOptions extends GraphicOptions {
	x: number;
	y: number;
	w: number;
	h: number;
	radii?: number;
}

export interface RectangleFromCenterOptions extends GraphicOptions {
	x: number;
	y: number;
	w: number;
	h: number;
	radii?: number;
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
		this.radii = options.radii ?? 0;
	}

	public override aabb(): Aabb {
		const [x, y] = this.matrix.applyVector(this.x, this.y);
		const aabb = Aabb.zero().offset(new Offset(x, y)).grow([this.w, this.h]);

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		const { style, radii } = this;
		const [x, y] = [this.x + offset.dx, this.y + offset.dy];
		const [w, h] = [this.w, this.h];
		canvas.drawRect(x, y, w, h, radii, style);
	}

	// public override copyWith(options: CopyWithParameter<RectangleOptions>): Rectangle {
	// 	return new Rectangle({
	// 		id: this.id,
	// 		x: options.x ?? this.x,
	// 		y: options.y ?? this.y,
	// 		w: options.w ?? this.w,
	// 		h: options.h ?? this.h,
	// 		radii: options.radii ?? this.radii,
	// 		style: options.style ?? this.style,
	// 	});
	// }

	public override hitTest(point: Point): this | undefined {
		// // TODO 没有判断圆角
		// const [x, y] = point;
		// const { x: leftTopX, y: leftTopY, w, h } = this;
		// const rightBottomX = leftTopX + w;
		// const rightBottomY = leftTopY + h;

		// if (x >= leftTopX && x <= rightBottomX && y >= leftTopY && y <= rightBottomY) return this;

		// return undefined;

		const [x, y] = point;
		const { x: leftTopX, y: leftTopY, w, h, radii } = this;
		const rightBottomX = leftTopX + w;
		const rightBottomY = leftTopY + h;

		if (x >= leftTopX && x <= rightBottomX && y >= leftTopY && y <= rightBottomY) return this;

		if (x >= leftTopX && x <= leftTopX + w && y >= leftTopY && y <= leftTopY + h) {
			return this; // 点在矩形内部
			// 检查点是否在圆角矩形的圆角区域内
		} else if (
			(x >= leftTopX && x <= leftTopX + radii && y >= leftTopY && y <= leftTopY + radii) ||
			(x >= leftTopX + w - radii && x <= leftTopX + w && y >= leftTopY && y <= leftTopY + radii) ||
			(x >= leftTopX && x <= leftTopX + radii && y >= leftTopY + h - radii && y <= leftTopY + h) ||
			(x >= leftTopX + w - radii && x <= leftTopX + w && y >= leftTopY + h - radii && y <= leftTopY + h)
		) {
			const res =
				Math.sqrt(Math.pow(x - (leftTopX + radii), 2) + Math.pow(y - (leftTopY + radii), 2)) <= radii ||
				Math.sqrt(Math.pow(x - (leftTopX + w - radii), 2) + Math.pow(y - (leftTopY + radii), 2)) <= radii ||
				Math.sqrt(Math.pow(x - (leftTopX + radii), 2) + Math.pow(y - (leftTopY + h - radii), 2)) <= radii ||
				Math.sqrt(Math.pow(x - (leftTopX + w - radii), 2) + Math.pow(y - (leftTopY + h - radii), 2)) <= radii;

			if (res) return this;
		}

		return;
	}

	// public override equals(other: Rectangle): boolean {
	// 	return (
	// 		super.equals(other) &&
	// 		this.x === other.x &&
	// 		this.y === other.y &&
	// 		this.w === other.w &&
	// 		this.h === other.h &&
	// 		this.radii === other.radii
	// 	);
	// }
}
