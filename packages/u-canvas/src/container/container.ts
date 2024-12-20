import type { Parent, Child, Equatable, Paintable, Hittable, Point } from "../types";
import { Transform } from "../transform";
import { Offset } from "../offset";
import { Paint } from "../u-paint";
import { Canvas } from "../renderer/canvas";

export interface ContainerOptions extends Parent {
	x: number;
	y: number;
	children?: Child[];
}

export class Container extends Transform implements Paintable, Hittable, Equatable<Container>, Parent {
	public x: number;

	public y: number;

	public parent?: Container;

	public children: Child[];

	constructor(options: ContainerOptions) {
		super();
		this.x = options.x;
		this.y = options.y;
		this.parent = options.parent;
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

	public hitTest(point: Point): boolean {
		return this.children.some(child => child.hitTest(point));
	}

	public addChild(child: Child): void {
		child.parent = this;
		this.children.push(child);
	}

	public removeChild(child: Child): void {
		const index = this.children.indexOf(child);
		if (index !== -1) {
			child.parent = undefined;
			this.children.splice(index, 1);
		}
	}

	public clear(): void {
		this.children.forEach(child => (child.parent = undefined));
		this.children.length = 0;
	}

	public equals(other: Container): boolean {
		return this === other || this.children.every(child => child.equals(other));
	}
}
