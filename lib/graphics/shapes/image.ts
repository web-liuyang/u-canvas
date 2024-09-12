import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Point } from "../../types";

export interface ImageOptions extends GraphicOptions {
	image: CanvasImageSource;
	x: number;
	y: number;
	w?: number;
	h?: number;
}

export class Image extends Graphic<ImageOptions> {
	public override readonly type = "Image";

	public readonly image: CanvasImageSource;

	public readonly x: number;

	public readonly y: number;

	public readonly w?: number;

	public readonly h?: number;

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

			if (w !== undefined && h !== undefined) {
				ctx.drawImage(image, x, y, w, h);
			} else {
				ctx.drawImage(image, x, y);
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
