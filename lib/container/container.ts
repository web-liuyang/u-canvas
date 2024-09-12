import { Parent, Child, Equatable, Paintable, Hittable, Point } from "../types";
import { Transform } from "../transform";
import { Offset } from "../offset";

export interface ContainerOptions extends Parent {
	x: number;
	y: number;
	// w: number;
	// h: number;
	children?: Child[];
}

export class Container extends Transform implements Paintable, Hittable, Equatable<Container>, Parent {
	public readonly x: number;

	public readonly y: number;

	// public readonly w: number;

	// public readonly h: number;

	// public readonly parent?: Container;
	public readonly parent?: Container;

	public readonly children: Child[];

	constructor(options: ContainerOptions) {
		super();
		this.x = options.x;
		this.y = options.y;
		// this.w = options.w;
		// this.h = options.h;
		this.parent = options.parent;
		this.children = options.children ?? [];
	}

	public paint(ctx: CanvasRenderingContext2D, offset: Offset): void {
		this.children.forEach(child => child.paint(ctx, offset));
	}

	public hitTest(point: Point): boolean {
		return this.children.some(child => child.hitTest(point));
	}

	public addChild(child: Child): void {
		this.children.push(child);
	}

	public removeChild(child: Child): void {
		const index = this.children.indexOf(child);
		if (index !== -1) {
			this.children.splice(index, 1);
		}
	}

	public clear(): void {
		this.children.length = 0;
	}

	public equals(other: Container): boolean {
		return (
			this === other || this.children.every(child => child.equals(other))
			// (this.w === other.w &&
			// this.h === other.h &&
		);
	}
}
