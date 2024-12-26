import { Offset } from "../offset";
import { UCanvas } from "../u-canvas";
import { Canvas } from "./canvas";
import { renderCanvas } from "./entity-renderer";
import { EntityFactory } from "./entity";

export class Renderer {
	private canvas: UCanvas;

	constructor(canvas: UCanvas) {
		this.canvas = canvas;
	}

	public renderRoot(): void {
		const offset = new Offset(0, 0);
		const canvas = new Canvas({
			matrix: this.canvas.root.worldMatrix,
		});
		// canvas.matrix = this.canvas.root.worldMatrix;
		this.canvas.root.offset = offset;
		this.canvas.root.paint(canvas, offset);
		const entity = EntityFactory.createCanvasEntity(canvas);
		renderCanvas(entity, this.canvas.ctx);
	}
}
