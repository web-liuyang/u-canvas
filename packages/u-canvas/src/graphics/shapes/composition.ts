import type { GraphicOptions } from "./graphic";
import { Canvas } from "../../renderer";
import { Offset, Point } from "../../offset";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

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

	public override getAabb(): Aabb {
		const newAabb = this.children.reduce((aabb, item) => {
			const itemAabb = item.getAabb();
			const minX = aabb.min.x < itemAabb.min.x ? aabb.min.x : itemAabb.min.x;
			const minY = aabb.min.y < itemAabb.min.y ? aabb.min.y : itemAabb.min.y;
			const maxX = aabb.max.x > itemAabb.max.x ? aabb.max.x : itemAabb.max.x;
			const maxY = aabb.max.y > itemAabb.max.y ? aabb.max.y : itemAabb.max.y;

			return new Aabb(new Point(minX, minY), new Point(maxX, maxY));
		}, Aabb.world().swap());

		return newAabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
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
			const hitTarget = child.hitTest(point);
			if (hitTarget) return hitTarget;
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
