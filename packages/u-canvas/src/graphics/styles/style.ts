// import { Cloneable, Equatable } from "../../types";
// import { Fill } from "./fill";
// import { Stroke } from "./stroke";

// export interface StyleOptions {
// 	stroke: Stroke;
// 	fill: Fill;
// }

// export class Style implements Cloneable<StyleOptions>, Equatable<Style> {
// 	public stroke: Stroke;

// 	public fill: Fill;

// 	constructor(options?: Partial<StyleOptions>) {
// 		this.stroke = options?.stroke ?? new Stroke();
// 		this.fill = options?.fill ?? new Fill();
// 	}

// 	public copyWith(options: Partial<StyleOptions>): Style {
// 		return new Style({
// 			stroke: options.stroke ?? this.stroke,
// 			fill: options.fill ?? this.fill,
// 		});
// 	}

// 	public equals(other: Style): boolean {
// 		return this.stroke.equals(other.stroke) && this.fill.equals(other.fill);
// 	}
// }

export interface Style {
	stroke?: StrokeStyle;
	fill?: FillStyle;
	text?: TextStyle;
}

export interface StrokeStyle {
	color?: string;
	width?: number;
	cap?: StrokeCap;
	join?: StrokeJoin;
}

export enum StrokeCap {
	butt = "butt",
	round = "round",
	square = "square",
}

export enum StrokeJoin {
	miter = "miter",
	round = "round",
	bevel = "bevel",
}

export interface FillStyle {
	color?: string;
}

export interface TextStyle {
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: FontWeight;
	direction?: CanvasDirection;
	letterSpacing?: number;
	wordSpacing?: number;
	textAlign?: CanvasTextAlign;
	textBaseline?: CanvasTextBaseline;
	textRendering?: CanvasTextRendering;
}

export enum FontWeight {
	"bold",
	"normal",
}
