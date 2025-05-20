import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import { Offset } from "../../coords";
import { Point } from "../../coords";
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
	dx: number;
	dy: number;
	dw: number;
	dh: number;
}

// export type ImageOptions = ImagePureOptions & ImageWithSizeOptions & ImageWithShearOptions;
export interface ImageOptions extends GraphicOptions{
	image: ImageResource;
	x: number;
	y: number;
	w?: number;
	h?: number;
	dx?: number;
	dy?: number;
	dw?: number;
	dh?: number;
}

export class Image extends Graphic<ImageOptions> {
	public override readonly type = "Image";

	/**
	 * 图像资源
	 */
	public image: ImageResource;

	/**
	 * 基点 x 坐标
	 */
	public x: number;

	/**
	 * 基点 y 坐标
	 */
	public y: number;

	/**
	 * 宽度
	 */
	public w?: number;

	/**
	 * 高度
	 */
	public h?: number;

	/**
	 * 裁剪图像数据的偏移量, 默认是整个图像数据的左上角（x 坐标）
	 */
	public dx?: number;

	/**
	 * 裁剪图像数据的偏移量, 默认是整个图像数据的左上角（y 坐标）
	 */
	public dy?: number;

	/**
	 * 裁剪图像数据的宽度, 默认是整个图像数据的宽度
	 */
	public dw?: number;

	/**
	 * 裁剪图像数据的宽度, 默认是整个图像数据的高度
	 */
	public dh?: number;

	// constructor(options: ImagePureOptions);
	// constructor(options: ImageWithSizeOptions);
	// constructor(options: ImageWithShearOptions);
	constructor(options: ImageOptions) {
		super(options);

		this.image = options.image;
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
		this.dx = options.dx;
		this.dy = options.dy;
		this.dw = options.dw;
		this.dh = options.dh;
	}

	public override getAabb(): Aabb {
		// 指定了图片宽高直接计算
		if (this.w && this.h) {
			const { x, y } = this.matrix.apply(new Point(this.x, this.y));
			const aabb = Aabb.zero().offseted(new Offset(x, y)).grew(new Offset(this.w, this.h));

			return aabb;
		} else {
			// 需要知道图片大小, 可以通过请求来计算, 但目前uniappx暂时不支持图片请求
		}

		return Aabb.zero();
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { image, w, h, dx, dy, dw, dh, style } = this;
		const { x, y } = this.toGlobalPoint(new Point(this.x, this.y));

		canvas.drawImage(image, x, y, w, h, dx, dy, dw, dh);
	}

	public override hitTest(point: Point): this | undefined {
		if (this.w && this.h) {
			const aabb = this.getGlobalAabb();
			if (aabb.contains(point)) return this;
		}

		// TODO 没有传宽高就需要自己计算了
		// if (x >= dx && x <= dx + dw && y >= dy && y <= dy + dh) return this;

		return undefined;
	}
}
