import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Point } from "../../types";
import { Graphic } from "../graphic";
import { TextStyle } from "../styles";
import { getTextStyle } from "../utils";
import { Offset, Paint } from "../..";
import { DrawingBoard } from "../../drawing-board";

export interface TextOptions extends GraphicOptions {
	x: number;
	y: number;
	text: string;

	style?: TextStyle;
}

export class Text extends Graphic<TextOptions> {
	public override readonly type = "Text";

	public text: TextOptions["text"];

	public x: TextOptions["x"];

	public y: TextOptions["y"];

	public override style: NonNullable<TextOptions["style"]>;

	constructor(options: TextOptions) {
		super(options);
		this.text = options.text;
		this.x = options.x;
		this.y = options.y;
		this.style = options.style ?? new TextStyle();
	}

	protected override draw(ctx: CanvasRenderingContext2D, fn: () => void): void {
		ctx.save();
		ctx.setTransform(
			this.worldMatrix.a,
			this.worldMatrix.b,
			this.worldMatrix.c,
			this.worldMatrix.d,
			this.worldMatrix.e,
			this.worldMatrix.f
		);
		const style = getTextStyle(ctx);
		this.applyStyle(ctx, this.style);
		fn();
		this.applyStyle(ctx, style);

		ctx.restore();
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

	public override paint(board: DrawingBoard, offset: Offset): void {
		const [x, y] = [this.x + offset.dx, this.y + offset.dy];
		const { text, style } = this;
		board.drawText(text, x, y, style);
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
	public override hitTest(point: Point): boolean {
		// const [x, y] = point;
		const { x, y, text } = this;
		return false;
	}
	public override equals(other: Text): boolean {
		return super.equals(other) && this.x === other.x && this.y === other.y && this.text === other.text;
	}
}
