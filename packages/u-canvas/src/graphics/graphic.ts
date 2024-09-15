import { Cloneable, Equatable, Hittable, Paintable, Point, CoordinateScope, Parent } from "../types";
import { Offset } from "../offset";
import { Style } from "./styles";
import { generateUUID, getStyle } from "./utils";
import { Transform } from "../transform";
import { Container } from "../container";

export type GraphicId = string;

export interface GraphicOptions {
	id?: GraphicId;
	coordinateScope?: CoordinateScope;
	style?: Style;
}

export type CopyWithParameter<T extends GraphicOptions> = Partial<Omit<T, "id">>;

export abstract class Graphic<T extends GraphicOptions = GraphicOptions>
	extends Transform
	implements Paintable, Cloneable<CopyWithParameter<T>>, Equatable<Graphic>, Hittable, Parent
{
	public parent?: Container;

	public abstract readonly type: string;

	public readonly id: NonNullable<T["id"]>;

	public readonly coordinateScope: GraphicOptions["coordinateScope"];

	public readonly style: Style;

	constructor(options: Partial<T>) {
		super();
		this.id = options.id ?? generateUUID();
		this.coordinateScope = options.coordinateScope ?? CoordinateScope.local;
		this.style = options.style ?? new Style();
	}

	public abstract paint(ctx: CanvasRenderingContext2D, offset: Offset): void;

	public calLocationWithScope(point: Point, offset: Offset): Point {
		if (this.coordinateScope === CoordinateScope.local) {
			return [point[0] + offset.dx, point[1] + offset.dy];
		}

		return point;
	}

	public abstract copyWith(options: CopyWithParameter<T>): Graphic<T>;

	public abstract hitTest(point: Point): boolean;

	protected draw(ctx: CanvasRenderingContext2D, fn: () => void): void {
		const style = getStyle(ctx);
		this.applyStyle(ctx, this.style);
		fn();
		this.applyStyle(ctx, style);
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
