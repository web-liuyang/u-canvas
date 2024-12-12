import { Cloneable, Equatable, Hittable, Paintable, Point, CoordinateScope, Parent } from "../types";
import { Offset } from "../offset";
import { Style } from "./styles";
import { generateUUID, getStyle } from "./utils";
import { Transform } from "../transform";
import { Container } from "../container";
import { Paint } from "../u-paint";

export type GraphicId = string;

export interface GraphicOptions {
	id?: GraphicId;
	style?: Style;
}

export type CopyWithParameter<T extends GraphicOptions> = Partial<Omit<T, "id">>;

export abstract class Graphic<T extends GraphicOptions = GraphicOptions>
	extends Transform
	implements Paintable, Cloneable<CopyWithParameter<T>>, Equatable<Graphic>, Hittable, Parent
{
	public abstract readonly type: string;

	public readonly id: NonNullable<T["id"]>;

	public style: Style;

	public parent?: Container;

	constructor(options: Partial<T>) {
		super();
		this.id = options.id ?? generateUUID();
		this.style = options.style ?? new Style();
	}

	public abstract paint(paint: Paint, offset: Offset): void;

	public abstract copyWith(options: CopyWithParameter<T>): Graphic<T>;

	public abstract hitTest(point: Point): boolean;

	protected draw(ctx: CanvasRenderingContext2D, fn: () => void): void {
		ctx.save();
		ctx.setTransform(
			this.worldMatrix.a,
			this.worldMatrix.b,
			this.worldMatrix.c,
			this.worldMatrix.d,
			this.worldMatrix.e,
			this.worldMatrix.f
		);
		const style = getStyle(ctx);
		this.applyStyle(ctx, this.style);
		fn();
		this.applyStyle(ctx, style);
		ctx.restore();
	}

	protected applyStyle(ctx: CanvasRenderingContext2D, style: Style): void {
		ctx.strokeStyle = style.stroke.color;
		ctx.lineWidth = style.stroke.width;
		ctx.lineCap = style.stroke.cap;
		ctx.lineJoin = style.stroke.join;
		ctx.fillStyle = style.fill.color;
	}

	public equals(other: Graphic): boolean {
		return this === other || (this.type === other.type && this.id === other.id && this.style.equals(other.style));
	}
}
