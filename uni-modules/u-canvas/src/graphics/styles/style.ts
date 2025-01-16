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
	fontWeight?: CanvasFontWeight;
	direction?: CanvasDirection;
	letterSpacing?: number;
	wordSpacing?: number;
	textAlign?: CanvasTextAlign;
	textBaseline?: CanvasTextBaseline;
	textRendering?: CanvasTextRendering;
}

export type CanvasFontWeight = "bold" | "normal";

export const defaultStyle: Style = {
	stroke: {
		color: "blue",
		width: 1,
		cap: StrokeCap.butt,
		join: StrokeJoin.miter,
	},
	fill: {
		color: "black",
	},
	text: {
		fontSize: 24,
		fontFamily: "serif",
		fontWeight: "bold",
		direction: "ltr",
		letterSpacing: 0,
		wordSpacing: 0,
		textAlign: "start",
		textBaseline: "alphabetic",
		textRendering: "auto",
	},
};
