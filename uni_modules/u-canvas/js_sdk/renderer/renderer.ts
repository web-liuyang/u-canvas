import type { UCanvas } from "../u-canvas";
import { Offset } from "../coords";
import { Canvas } from "./canvas";
import { renderCanvas } from "./entity-renderer";
import { EntityFactory } from "./entity";

export class Renderer {
	constructor(public canvas: UCanvas) {}

	public renderRoot(): void {
		const offset = new Offset(0, 0);
		const canvas = new Canvas({
			matrix: this.canvas.root.getWorldMatrix(),
		});

		this.canvas.root.uCanvas = this.canvas;
		this.canvas.root.paint(canvas, offset);

		const entity = EntityFactory.createCanvasEntity(canvas);
		renderCanvas(entity, this.canvas.ctx);
	}
}
