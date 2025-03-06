import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset } from "../../offset";
import { Point } from "../../offset";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

export interface TextOptions extends GraphicOptions {
	text: string;
	x: number;
	y: number;
}

export class Text extends Graphic<TextOptions> {
	public override readonly type = "Text";

	public text: string;

	public x: number;

	public y: number;

	constructor(options: TextOptions) {
		super(options);
		this.text = options.text;
		this.x = options.x;
		this.y = options.y;
	}

	public override getAabb(): Aabb {
		if (!this.uCanvas) throw new Error("uCanvas is not initialized");
		// TODO iOS, Andriod 只能获取到宽度, 所以无法计算 aabb
		const ctx = this.uCanvas.ctx;
		const tm = ctx.measureText(this.text);
		const { x, y } = this.matrix.apply(new Point(this.x, this.y - tm.actualBoundingBoxAscent));
		const tw = tm.width;
		const th = tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent;
		const aabb = Aabb.zero().offset(new Offset(x, y)).grow(new Offset(tw, th));

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { x, y } = this.toGlobalPoint(new Point(this.x, this.y));
		const { text, style } = this;

		canvas.drawText(text, x, y, style);
		// const aabb = this.getGlobalAabb();
		// canvas.drawRect(aabb.min.x, aabb.min.y, aabb.max.x - aabb.min.x, aabb.max.y - aabb.min.y, 0, style);
	}

	public override hitTest(point: Point): this | undefined {
		const { x, y } = point;
		const aabb = this.getGlobalAabb();

		if (x >= aabb.min.x && x <= aabb.max.x && y >= aabb.min.y && y <= aabb.max.y) return this;

		return undefined;
	}
}
