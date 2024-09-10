import type { CopyWithParameter, GraphicOptions } from "./graphic";
import { Graphic } from "./graphic";

import { TextStyle } from "./text-style";
import { getTextStyle } from "./utils";

export interface TextOptions extends GraphicOptions {
	x: number;
	y: number;
	text: string;

	style?: TextStyle;
}

export class Text extends Graphic<TextOptions> {
	public override readonly type = "Text";

	public readonly text: TextOptions["text"];

	public readonly x: TextOptions["x"];

	public readonly y: TextOptions["y"];

	public override readonly style: NonNullable<TextOptions["style"]>;

	constructor(options: TextOptions) {
		super(options);
		this.text = options.text;
		this.x = options.x;
		this.y = options.y;
		this.style = options.style ?? new TextStyle();
	}

	protected override draw(ctx: CanvasRenderingContext2D, fn: () => void): void {
		const style = getTextStyle(ctx);

		this.applyStyle(ctx, this.style);
		fn();
		this.applyStyle(ctx, style);
	}

	protected override applyStyle(ctx: CanvasRenderingContext2D, style: TextStyle): void {
		super.applyStyle(ctx, style);

		ctx.font = `${style.fontSize}px ${style.fontFamily}`;
		ctx.direction = style.direction;
		ctx.letterSpacing = `${style.letterSpacing}px`;
		ctx.wordSpacing = `${style.wordSpacing}px`;
		ctx.textAlign = style.textAlign;
		ctx.textBaseline = style.textBaseline;
		ctx.textRendering = style.textRendering;
	}

	public override paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const { x, y, text } = this;
			ctx.fillText(text, x, y);
			ctx.strokeText(text, x, y);
		});
	}
	public override copyWith(options: CopyWithParameter<TextOptions>): Text {
		return new Text({
			id: this.id,
			x: options.x ?? this.x,
			y: options.y ?? this.y,
			text: options.text ?? this.text,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}
	public override hit(point: Point): boolean {
		// const [x, y] = point;
		const { x, y, text } = this;
		return false;
	}
	public override equals(other: Text): boolean {
		return super.equals(other) && this.x === other.x && this.y === other.y && this.text === other.text;
	}
}
