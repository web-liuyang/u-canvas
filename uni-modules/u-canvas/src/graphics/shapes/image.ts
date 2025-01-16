import type { GraphicOptions } from "./graphic";
import type { Canvas } from "../../renderer";
import type { Offset } from "../../offset";
import { Point } from "../../offset";
import { Graphic } from "./graphic";
import { Aabb } from "../aabb";

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
	}

	public override getAabb(): Aabb {
		// 需要知道图片大小
		// const aabb = this.parent?.aabb() ?? Aabb.zero();
		// const [x, y] = this.matrix.applyVector(this.sx, this.sy);
		// const offset = new Offset(x, y);
		// const newAabb = aabb.offset(offset).grow([this.dw, this.dh]);
		// return newAabb;

		return Aabb.zero();
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		super.paint(canvas, offset);
		const { image, sw, sh, dx, dy, dw, dh, style } = this;
		const { x: sx, y: sy } = this.toGlobalPoint(new Point(this.sx, this.sy));

		canvas.drawImage(image, sx, sy);
	}

	public override hitTest(point: Point): this | undefined {
		const { sx, sy, sw, sh } = this;
		// TODO 没有传宽高就需要自己计算了

		// if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) return this;

		return undefined;
	}
}
