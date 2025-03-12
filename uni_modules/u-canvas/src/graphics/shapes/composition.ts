import type { GraphicOptions } from "./graphic";
import { Canvas } from "../../renderer";
import { Offset, Point } from "../../offset";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

export interface CompositionOptions extends GraphicOptions {
	/**
	 * 基点 x 坐标
	 */
	x: number;
	/**
	 * 基点 y 坐标
	 */
	y: number;
	/**
	 * 子图形列表
	 */
	children?: Graphic[];
}

export class Composition extends Graphic<CompositionOptions> {
	public override readonly type = "Composition";

	/**
	 * 基点 x 坐标
	 */
	public x: number;

	/**
	 * 基点 y 坐标
	 */
	public y: number;

	/**
	 * 子图形列表
	 */
	public children: Graphic[];

	constructor(options: CompositionOptions) {
		super(options);
		this.x = options.x;
		this.y = options.y;
		this.children = options.children ?? [];
		this.children.forEach(child => (child.parent = this));
	}

	public override getAabb(): Aabb {
		if (this.children.length === 0) return Aabb.zero();

		const position = this.matrix.apply(new Point(this.x, this.y));

		const newAabb = this.children
			.reduce((aabb, item) => {
				const itemAabb = item.getAabb();
				const minX = aabb.min.x < itemAabb.min.x ? aabb.min.x : itemAabb.min.x;
				const minY = aabb.min.y < itemAabb.min.y ? aabb.min.y : itemAabb.min.y;
				const maxX = aabb.max.x > itemAabb.max.x ? aabb.max.x : itemAabb.max.x;
				const maxY = aabb.max.y > itemAabb.max.y ? aabb.max.y : itemAabb.max.y;

				return new Aabb(new Point(minX, minY), new Point(maxX, maxY));
			}, Aabb.world().swap())
			.offset(position.toOffset());

		return newAabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const offsetSelf = new Offset(this.x, this.y).add(offset);
		this.children.forEach(child => {
			const childCanvas = new Canvas({ matrix: child.worldMatrix });
			child.uCanvas = this.uCanvas;
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

	/**
	 * 添加子图形
	 * @param child 图形
	 */
	public addChild(child: Graphic): void {
		child.parent = this;
		this.children.push(child);
	}

	/**
	 * 移除子图形
	 * @param child 图形
	 */
	public removeChild(child: Graphic): void {
		const index = this.children.indexOf(child);
		if (index !== -1) {
			child.parent = undefined;
			this.children.splice(index, 1);
		}
	}

	/**
	 * 清空子图形
	 */
	public clearChildren(): void {
		this.children.forEach(child => (child.parent = undefined));
		this.children.length = 0;
	}
}
