import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset } from "../../offset";
import { Point } from "../../offset";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

export interface ImageResource {
	src: string;
	onload?: ((...args: any[]) => void) | null;
}

export interface ImagePureOptions extends GraphicOptions {
	image: ImageResource;
	x: number;
	y: number;
}

export interface ImageWithSizeOptions extends GraphicOptions {
	image: ImageResource;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface ImageWithShearOptions extends GraphicOptions {
	image: ImageResource;
	x: number;
	y: number;
	w: number;
	h: number;
	sx: number;
	sy: number;
	sw: number;
	sh: number;
}

export type ImageOptions = ImagePureOptions & ImageWithSizeOptions & ImageWithShearOptions;

export class Image extends Graphic<ImageOptions> {
	public override readonly type = "Image";

	public image: ImageResource;

	public x: number;

	public y: number;

	public w?: number;

	public h?: number;

	public sx?: number;

	public sy?: number;

	public sw?: number;

	public sh?: number;

	constructor(options: ImagePureOptions);
	constructor(options: ImageWithSizeOptions);
	constructor(options: ImageWithShearOptions);
	constructor(options: ImageOptions) {
		super(options);

		this.image = options.image;
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
		this.sx = options.sx;
		this.sy = options.sy;
		this.sw = options.sw;
		this.sh = options.sh;
	}

	public override getAabb(): Aabb {
		// 指定了图片宽高直接计算
		if (this.w && this.h) {
			const { x, y } = this.matrix.apply(new Point(this.x, this.y));
			const aabb = Aabb.zero().offset(new Offset(x, y)).grow(new Offset(this.w, this.h));

			return aabb;
		} else {
			// 需要知道图片大小, 可以通过请求来计算, 但目前uniappx暂时不支持图片请求
		}

		return Aabb.zero();
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { image, w, h, sx, sy, sw, sh, style } = this;
		const { x, y } = this.toGlobalPoint(new Point(this.x, this.y));

		canvas.drawImage(image, x, y, w, h, sx, sy, sw, sh);
	}

	public override hitTest(point: Point): this | undefined {
		if (this.w && this.h) {
			const aabb = this.getGlobalAabb();
			if (aabb.contains(point)) return this;
		}

		// TODO 没有传宽高就需要自己计算了
		// if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) return this;

		return undefined;
	}
}
