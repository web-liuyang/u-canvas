import { Style } from "./style";
import { generateUUID, getStyle } from "./utils";

export interface Drawable {
	paint(ctx: CanvasRenderingContext2D): void;
}

export type GraphicId = string;

export interface GraphicOptions {
	id?: GraphicId;
	// selected?: boolean;
	// editing?: boolean;
	style?: Style;
}

export type CopyWithParameter<T extends GraphicOptions> = Partial<Omit<T, "id">>;

export abstract class Graphic<T extends GraphicOptions = GraphicOptions>
	implements Drawable, Cloneable<CopyWithParameter<T>>, Equatable<Graphic>
{
	public abstract readonly type: string;

	public readonly id: NonNullable<T["id"]>;

	// public readonly selected: boolean;

	// public readonly editing: boolean;

	public readonly style: Style;

	constructor(options: Partial<T>) {
		this.id = options.id ?? generateUUID();

		// this.selected = options.selected ?? false;
		// this.editing = options.editing ?? false;
		this.style = options.style ?? new Style();
	}

	public abstract paint(ctx: CanvasRenderingContext2D): void;

	public abstract copyWith(options: CopyWithParameter<T>): Graphic<T>;

	public abstract hit(point: Point): boolean;

	// public abstract towingPointPaint(ctx: CanvasRenderingContext2D): void;

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
		return (
			this === other ||
			(this.type === other.type && this.id === other.id && this.style.equals(other.style))
			// &&
			// this.selected === other.selected &&
			// this.editing === other.editing
		);
	}
}
