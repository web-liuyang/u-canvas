import { Style, StyleOptions } from "./style";

export interface TextStyleOptions extends StyleOptions {
	fontSize: number;
	fontFamily: string;
	direction: CanvasDirection;
	letterSpacing: number;
	wordSpacing: number;
	textAlign: CanvasTextAlign;
	textBaseline: CanvasTextBaseline;
	textRendering: CanvasTextRendering;
}

export class TextStyle extends Style {
	public fontSize: TextStyleOptions["fontSize"];

	public fontFamily: TextStyleOptions["fontFamily"];

	public direction: TextStyleOptions["direction"];

	public letterSpacing: TextStyleOptions["letterSpacing"];

	public wordSpacing: TextStyleOptions["wordSpacing"];

	public textAlign: TextStyleOptions["textAlign"];

	public textBaseline: TextStyleOptions["textBaseline"];

	public textRendering: TextStyleOptions["textRendering"];

	constructor(options?: Partial<TextStyleOptions>) {
		super(options);
		this.fontSize = options?.fontSize ?? 14;
		this.fontFamily = options?.fontFamily ?? "sans-serif";
		this.direction = options?.direction ?? "inherit";
		this.letterSpacing = options?.letterSpacing ?? 0.5;
		this.wordSpacing = options?.wordSpacing ?? 0;
		this.textAlign = options?.textAlign ?? "start";
		this.textBaseline = options?.textBaseline ?? "alphabetic";
		this.textRendering = options?.textRendering ?? "auto";
	}

	public copyWith(options: Partial<TextStyle>): Style {
		return new TextStyle({
			fontSize: options.fontSize ?? this.fontSize,
			fontFamily: options.fontFamily ?? this.fontFamily,
			direction: options.direction ?? this.direction,
			letterSpacing: options.letterSpacing ?? this.letterSpacing,
			wordSpacing: options.wordSpacing ?? this.wordSpacing,
			textAlign: options.textAlign ?? this.textAlign,
			textBaseline: options.textBaseline ?? this.textBaseline,
			textRendering: options.textRendering ?? this.textRendering,
		});
	}

	public equals(other: TextStyle): boolean {
		return (
			super.equals(other) &&
			this.fontSize === other.fontSize &&
			this.fontFamily === other.fontFamily &&
			this.direction === other.direction &&
			this.letterSpacing === other.letterSpacing &&
			this.wordSpacing === other.wordSpacing &&
			this.textAlign === other.textAlign &&
			this.textBaseline === other.textBaseline &&
			this.textRendering === other.textRendering
		);
	}
}
