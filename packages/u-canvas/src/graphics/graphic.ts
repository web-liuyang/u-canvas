import type { Hittable, Paintable, Point, CoordinateScope, Parent } from "../types";
import { Offset } from "../offset";
import { Style } from "./styles";
import { generateUUID } from "./utils";
import { Transform } from "../transform";
import { Canvas } from "../renderer/canvas";
import { Aabb } from "./aabb";

export type GraphicId = string;

export interface GraphicOptions {
	id?: GraphicId;
	style?: Style;
	parent?: Graphic;
}

export abstract class Graphic<T extends GraphicOptions = GraphicOptions>
	extends Transform
	implements Paintable, Hittable<Graphic | undefined>, Parent<Graphic>
{
	public abstract readonly type: string;

	public readonly id: GraphicId;

	public style?: Style;

	public parent?: Graphic;

	constructor(options: T) {
		super();
		this.id = options.id ?? generateUUID();
		this.style = options.style;
		this.parent = options?.parent;
	}

	public abstract aabb(): Aabb;

	public abstract paint(canvas: Canvas, offset: Offset): void;

	public abstract hitTest(point: Point): Graphic | undefined;

	// public abstract copyWith(options: CopyWithParameter<T>): Graphic<T>;

	// public equals(other: Graphic): boolean {
	// 	return this === other || (this.type === other.type && this.id === other.id && this.style.equals(other.style));
	// }
}
