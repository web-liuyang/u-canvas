import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Point } from "../../types";
import { Offset } from "../../offset";
import { Matrix } from "../../transform";

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

	public x: number;

	public y: number;

	public w: number;

	public h: number;

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

	public get parentMatrix(): Matrix {
		return this.parent?.matrix ?? new Matrix();
	}

	public get currentMatrix() {
		return this.parentMatrix.multiply(this.matrix);
	}

	public override paint(ctx: CanvasRenderingContext2D, offset: Offset): void {
		this.draw(ctx, () => {
			const path = new Path2D();
			const [x, y] = [this.x, this.y] || this.calLocationWithScope([this.x, this.y], offset);
			const [w, h] = [this.w, this.h];
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

	public on(type: string, fn: () => void) {
		{
			// x,y 自己当前相对父级坐标
			// clientX,Y 相对于页面可显示区域左/顶边的距离
		}
	}
}
