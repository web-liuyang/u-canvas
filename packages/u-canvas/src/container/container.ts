import type { Parent, Child, Equatable, Paintable, Hittable, Point } from "../types";
import { Transform } from "../transform";
import { Offset } from "../offset";
import { Paint } from "../u-paint";
import { DrawingBoard } from "../drawing-board";

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

	public paint(board: DrawingBoard, offset: Offset): void {
		const offsetSelf = new Offset(this.x, this.y).add(offset);
		this.children.forEach(child => {
			const childDrawingBoard = new DrawingBoard({ matrix: child.worldMatrix });
			child.paint(childDrawingBoard, offsetSelf);
			board.addDrawingBoard(childDrawingBoard);
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
