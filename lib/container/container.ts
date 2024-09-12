import { Transform } from "../transform";

export interface ContainerOptions extends Parent<Container> {
	x: number;
	y: number;
	w: number;
	h: number;
	children?: Child<Container>[];
}

export class Container extends Transform implements Paintable, Hittable, Equatable<Container>, Parent<Container> {
	public readonly x: number;

	public readonly y: number;

	public readonly w: number;

	public readonly h: number;

	// public readonly parent?: Container;
	public readonly parent?: Container;

	public readonly children: Child<Container>[];

	constructor(options: ContainerOptions) {
		super();
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
		this.parent = options.parent;
		this.children = options.children ?? [];
	}

	public paint(ctx: CanvasRenderingContext2D): void {
		this.children.forEach(child => child.paint(ctx));
	}

	public hitTest(point: Point): boolean {
		return this.children.some(child => child.hitTest(point));
	}

	public addChild(child: Child<Container>): void {
		this.children.push(child);
	}

	public removeChild(child: Child<Container>): void {
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
			this === other || (this.w === other.w && this.h === other.h && this.children.every(child => child.equals(other)))
		);
	}
}
