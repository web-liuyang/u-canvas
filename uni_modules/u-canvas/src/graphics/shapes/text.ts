import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import type { Offset } from "../../offset";
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
		// const aabb = this.parent?.aabb() ?? Aabb.zero();
		// const [x, y] = this.matrix.applyVector(this.x, this.y);
		// const offset = new Offset(x, y);
		// const newAabb = aabb.offset(offset).grow([this.w, this.h]);
		// return newAabb;

		return Aabb.zero();
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { x, y } = this.toGlobalPoint(new Point(this.x, this.y));
		const { text, style } = this;

		canvas.drawText(text, x, y, style);
	}

	public override hitTest(point: Point): this | undefined {
		// const [x, y] = point;
		const { x, y, text, style } = this;

		// TODO 这里要计算文本的宽高后才能算命中

		return undefined;
	}
}
