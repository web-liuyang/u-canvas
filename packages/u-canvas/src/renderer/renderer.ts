import { getStyle } from "../graphics/utils";
import { Offset } from "../offset";
import { Paintable } from "../types";
import { UCanvas } from "../u-canvas";
import { Paint } from "../u-paint";

export class Renderer {
	private canvas: UCanvas;

	constructor(canvas: UCanvas) {
		this.canvas = canvas;
	}

	// public render(graphic: Paintable, offset?: Offset): void {
	public _render(graphic: Paintable, offset?: Offset): void {
		offset = new Offset(0, 0);

		graphic.paint(this.canvas.ctx, offset);
	}

	public renderRoot(): void {
		const offset = new Offset(0, 0);
		const paint = new Paint();
		this.canvas.root.paint(paint, offset);
	}

	protected draw(ctx: CanvasRenderingContext2D, fn: () => void): void {
		ctx.save();
		ctx.setTransform(
			this.worldMatrix.a,
			this.worldMatrix.b,
			this.worldMatrix.c,
			this.worldMatrix.d,
			this.worldMatrix.e,
			this.worldMatrix.f
		);
		const style = getStyle(ctx);
		this.applyStyle(ctx, this.style);
		fn();
		this.applyStyle(ctx, style);
		ctx.restore();
	}

	protected applyStyle(ctx: CanvasRenderingContext2D, style: Style): void {
		ctx.strokeStyle = style.stroke.color;
		ctx.lineWidth = style.stroke.width;
		ctx.lineCap = style.stroke.cap;
		ctx.lineJoin = style.stroke.join;
		ctx.fillStyle = style.fill.color;
	}
}
