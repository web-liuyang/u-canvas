import type { GraphicOptions } from "../graphic";
import type { Point } from "../../types";
import { Canvas } from "../../renderer";
import { Offset } from "../../offset";
import { Graphic } from "../graphic";

export interface CompositionOptions extends GraphicOptions {
	x: number;
	y: number;
	children?: Graphic[];
}

export class Composition extends Graphic<CompositionOptions> {
	public override readonly type = "Composition";

	public x: number;

	public y: number;

	public children: Graphic[];

	constructor(options: CompositionOptions) {
		super(options);
		this.x = options.x;
		this.y = options.y;
		this.children = options.children ?? [];
		this.children.forEach(child => (child.parent = this));
	}

	public paint(canvas: Canvas, offset: Offset): void {
		const offsetSelf = new Offset(this.x, this.y).add(offset);
		this.children.forEach(child => {
			const childCanvas = new Canvas({ matrix: child.worldMatrix });
			child.paint(childCanvas, offsetSelf);
			canvas.addCanvas(childCanvas);
		});
	}

	public override hitTest(point: Point) {
		if (this.children.length === 0) return undefined;
		for (let i = this.children.length - 1; i >= 0; i--) {
			const child = this.children[i];
			if (child.hitTest(point)) return child;
		}
		return undefined;
	}

	public addChild(child: Graphic): void {
		child.parent = this;
		this.children.push(child);
	}

	public removeChild(child: Graphic): void {
		const index = this.children.indexOf(child);
		if (index !== -1) {
			child.parent = undefined;
			this.children.splice(index, 1);
		}
	}

	public clearChildren(): void {
		this.children.forEach(child => (child.parent = undefined));
		this.children.length = 0;
	}

	// public equals(other: Container): boolean {
	// 	return this === other || this.children.every(child => child.equals(other));
	// }
}
