import type { GraphicOptions } from "../graphic";
import type { Point } from "../../types";
import type { Offset } from "../../offset";
import type { Canvas } from "../../renderer";
import { Graphic } from "../graphic";

export interface ImageResource {
	src: string;
	onload?: ((...args: any[]) => void) | null;
}

export interface ImagePureOptions extends GraphicOptions {
	image: ImageResource;
	sx: number;
	sy: number;
}

export interface ImageWithSizeOptions extends ImagePureOptions {
	sw: number;
	sh: number;
}

export interface ImageWithDirtyOptions extends ImageWithSizeOptions {
	dx: number;
	dy: number;
	dw: number;
	dh: number;
}

export type ImageOptions = ImagePureOptions & Partial<ImageWithSizeOptions> & Partial<ImageWithDirtyOptions>;

export class Image extends Graphic<ImageOptions> {
	public override readonly type = "Image";

	public image: ImageResource;

	public sx: number;

	public sy: number;

	public sw?: number;

	public sh?: number;

	public dx?: number;

	public dy?: number;

	public dw?: number;

	public dh?: number;

	constructor(options: ImagePureOptions);
	constructor(options: ImageWithSizeOptions);
	constructor(options: ImageWithDirtyOptions);
	constructor(options: ImageOptions) {
		super(options);

		this.image = options.image;
		this.sx = options.sx;
		this.sy = options.sy;

		const { sw, sh, dx, dy, dw, dh } = options;

		// if (
		// 	sw !== undefined &&
		// 	sh !== undefined &&
		// 	dx !== undefined &&
		// 	dy !== undefined &&
		// 	dw !== undefined &&
		// 	dh !== undefined
		// ) {
		// 	this.sw = sw;
		// 	this.sh = sh;
		// 	this.dx = dx;
		// 	this.dy = dy;
		// 	this.dw = dw;
		// 	this.dh = dh;
		// } else if (sw !== undefined && sh !== undefined) {
		// 	this.sw = sw;
		// 	this.sh = sh;
		// }
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		const { image, sw, sh, dx, dy, dw, dh, style } = this;
		const [sx, sy] = [this.sx + offset.dx, this.sy + offset.dy];

		canvas.drawImage(image, sx, sy);

		// if (
		// 	sw !== undefined &&
		// 	sh !== undefined &&
		// 	dx !== undefined &&
		// 	dy !== undefined &&
		// 	dw !== undefined &&
		// 	dh !== undefined
		// ) {
		// 	// @ts-expect-error uniapp-x api
		// 	canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
		// } else if (sw !== undefined && sh !== undefined) {
		// 	// @ts-expect-error uniapp-x api
		// 	canvas.drawImage(image, sx, sy, sw, sh);
		// } else {
		// 	// @ts-expect-error uniapp-x api
		// 	canvas.drawImage(image, sx, sy);
		// }
	}

	// public override copyWith(options: CopyWithParameter<ImageOptions>): Image {
	// 	const id = this.id;
	// 	const {
	// 		image = this.image,
	// 		sx = this.sx,
	// 		sy = this.sy,
	// 		sw = this.sw,
	// 		sh = this.sh,
	// 		dx = this.dx,
	// 		dy = this.dy,
	// 		dw = this.dw,
	// 		dh = this.dh,
	// 		style = this.style,
	// 	} = options;

	// 	if (
	// 		sw !== undefined &&
	// 		sh !== undefined &&
	// 		dx !== undefined &&
	// 		dy !== undefined &&
	// 		dw !== undefined &&
	// 		dh !== undefined
	// 	) {
	// 		return new Image({
	// 			id: id,
	// 			image: image,
	// 			sx: sx,
	// 			sy: sy,
	// 			sw: sw,
	// 			sh: sh,
	// 			dx: dx,
	// 			dy: dy,
	// 			dw: dw,
	// 			dh: dh,
	// 			style: style,
	// 		});
	// 	} else if (sw !== undefined && sh !== undefined) {
	// 		return new Image({
	// 			id: id,
	// 			image: image,
	// 			sx: sx,
	// 			sy: sy,
	// 			sw: sw,
	// 			sh: sh,
	// 			style: style,
	// 		});
	// 	} else {
	// 		return new Image({
	// 			id: id,
	// 			image: image,
	// 			sx: sx,
	// 			sy: sy,
	// 			style: style,
	// 		});
	// 	}
	// }

	public override hitTest(point: Point): this | undefined {
		const [x, y] = point;
		const { sx, sy, sw, sh } = this;
		// 没有传宽高就需要自己计算了

		// if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) return this;

		return undefined;
	}

	// public override equals(other: Image): boolean {
	// 	return (
	// 		super.equals(other) &&
	// 		this.image === other.image &&
	// 		this.sx === other.sx &&
	// 		this.sy === other.sy &&
	// 		this.sw === other.sw &&
	// 		this.sh === other.sh &&
	// 		this.dx === other.dx &&
	// 		this.dy === other.dy &&
	// 		this.dw === other.dw &&
	// 		this.dh === other.dh
	// 	);
	// }
}
