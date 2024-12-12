import { Offset } from "../offset";
import { Paintable } from "../types";
import { UCanvas } from "../u-canvas";
import { Paint } from "../u-paint";

export class Renderer {
	private canvas: UCanvas;

	constructor(canvas: UCanvas) {
		this.canvas = canvas;
	}

	public render(graphic: Paintable, offset?: Offset): void {
		offset = new Offset(0, 0);
		graphic.paint(this.canvas.ctx, offset);
	}

	public renderPaint(paint: Paint) {

    this.canvas.ctx;
		CanvasRenderingContext2D;
	}
}
