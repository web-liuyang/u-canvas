import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset } from "../../coords";
import { Point } from "../../coords";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

export interface TextOptions extends GraphicOptions {
	x: number;
	y: number;
	text: string;
}

export class Text extends Graphic<TextOptions> {
	public override readonly type = "Text";

	/**
	 * 基点 x 坐标
	 */
	public x: number;

	/**
	 * 基点 y 坐标
	 */
	public y: number;

	/**
	 * 文本
	 */
	public text: string;

	constructor(options: TextOptions) {
		super(options);
		this.x = options.x;
		this.y = options.y;
		this.text = options.text;
	}

	public override getAabb(): Aabb {
		if (!this.uCanvas) throw new Error("uCanvas is not initialized");
		// TODO iOS, Andriod 只能获取到宽度, 所以无法计算 aabb
		const ctx = this.uCanvas.ctx;
		const tm = ctx.measureText(this.text);
		// MP只能获取到 width, fontBoundingBoxAscent, fontBoundingBoxDescent
		const { x, y } = this.matrix.apply(new Point(this.x, this.y - tm.fontBoundingBoxAscent));
		const tw = tm.width;
		const th = tm.fontBoundingBoxAscent + tm.fontBoundingBoxDescent;
		const aabb = Aabb.zero().offseted(new Offset(x, y)).grew(new Offset(tw, th));

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { x, y } = this.toGlobalPoint(new Point(this.x, this.y));
		const { text, style } = this;

		canvas.drawText(text, x, y, style);
	}

	public override hitTest(point: Point): this | undefined {
		const { x, y } = point;
		const aabb = this.getGlobalAabb();

		if (x >= aabb.min.x && x <= aabb.max.x && y >= aabb.min.y && y <= aabb.max.y) return this;

		return undefined;
	}
}
