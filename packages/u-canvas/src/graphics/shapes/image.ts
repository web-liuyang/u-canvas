import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Point } from "../../types";

export interface ImageOptions extends GraphicOptions {
	image: { src: string } | ImageData;
	x: number;
	y: number;
	w?: number;
	h?: number;
}

export class Image extends Graphic<ImageOptions> {
	public override readonly type = "Image";

	public image: ImageOptions["image"];

	public x: ImageOptions["x"];

	public y: ImageOptions["y"];

	public w?: ImageOptions["w"];

	public h?: ImageOptions["h"];

	constructor(options: ImageOptions) {
		super(options);
		this.image = options.image;
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
	}

	public override paint(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx, () => {
			const { image, x, y, w, h } = this;
			const path = new Path2D();

			if (image instanceof ImageData) {
				if (w !== undefined && h !== undefined) {
					ctx.putImageData(image, x, y);
				} else {
					ctx.putImageData(image, x, y);
				}
			} else {
				if (w !== undefined && h !== undefined) {
					// @ts-expect-error uniapp-x api
					ctx.drawImage(image, x, y, w, h);
				} else {
					// @ts-expect-error uniapp-x api
					ctx.drawImage(image, x, y);
				}
			}

			ctx.stroke(path);
			ctx.fill(path);
		});
	}

	public override copyWith(options: CopyWithParameter<ImageOptions>): Image {
		return new Image({
			id: this.id,
			image: options.image ?? this.image,
			x: options.x ?? this.x,
			y: options.y ?? this.y,
			w: options.w ?? this.w,
			h: options.h ?? this.h,
			// selected: options.selected ?? this.selected,
			// editing: options.editing ?? this.editing,
			style: options.style ?? this.style,
		});
	}

	public override hitTest(point: Point): boolean {
		const { image, x, y, w, h } = this;

		// const rect = new Rectangle({
		// 	id: "hit",
		// 	x,
		// 	y,
		// 	w: w,
		// 	h: h,
		// });

		// if (rect.hit(point)) return true;

		return false;
	}

	public override equals(other: Image): boolean {
		return (
			super.equals(other) &&
			this.image === other.image &&
			this.x === other.x &&
			this.y === other.y &&
			this.w === other.w &&
			this.h === other.h
		);
	}
}
