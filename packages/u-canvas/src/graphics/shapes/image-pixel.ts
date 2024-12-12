import type { CopyWithParameter, GraphicOptions } from "../graphic";
import { Graphic } from "../graphic";
import { Point } from "../../types";
import { Offset, Paint } from "../..";

export interface ImagePixelPureOptions extends GraphicOptions {
	imageData: ImageData;
	x: number;
	y: number;
}

export interface ImagePixelWithDirtyOptions extends ImagePixelPureOptions {
	dx: number;
	dy: number;
	dw: number;
	dh: number;
}

export type ImagePixelOptions = ImagePixelPureOptions & Partial<ImagePixelWithDirtyOptions>;

export class ImagePixel extends Graphic<ImagePixelOptions> {
	public override readonly type = "ImagePixel";

	public imageData: ImagePixelOptions["imageData"];

	public x: ImagePixelOptions["x"];

	public y: ImagePixelOptions["y"];

	public dx: ImagePixelOptions["dx"];

	public dy: ImagePixelOptions["dy"];

	public dw: ImagePixelOptions["dw"];

	public dh: ImagePixelOptions["dh"];

	constructor(options: ImagePixelWithDirtyOptions);
	constructor(options: ImagePixelPureOptions);
	constructor(options: ImagePixelOptions) {
		super(options);

		this.imageData = options.imageData;
		this.x = options.x;
		this.y = options.y;

		if (
			options?.dx !== undefined &&
			options?.dy !== undefined &&
			options?.dw !== undefined &&
			options?.dh !== undefined
		) {
			this.dx = options?.dx;
			this.dy = options?.dy;
			this.dw = options?.dw;
			this.dh = options?.dh;
		}
	}

	public override paint(paint: Paint, offset: Offset): void {
		const { imageData, dx, dy, dw, dh } = this;
		const [x, y] = this.worldMatrix.applyVector([this.x + offset.dx, this.y + offset.dy]);
		const path = new Path2D();

		if (dx !== undefined && dy !== undefined && dw !== undefined && dh !== undefined) {
			paint.putImageData(imageData, x, y, dx, dy, dw, dh);
		} else {
			paint.putImageData(imageData, x, y);
		}

		paint.stroke(path);
		paint.fill(path);
	}

	public override copyWith(options: CopyWithParameter<ImagePixelOptions>): ImagePixel {
		const dx = options.dx ?? this.dx;
		const dy = options.dy ?? this.dy;
		const dw = options.dw ?? this.dw;
		const dh = options.dh ?? this.dh;

		if (dx !== undefined && dy !== undefined && dw !== undefined && dh !== undefined) {
			return new ImagePixel({
				id: this.id,
				imageData: options.imageData ?? this.imageData,
				x: options.x ?? this.x,
				y: options.y ?? this.y,
				dx,
				dy,
				dw,
				dh,
				style: options.style ?? this.style,
			});
		} else {
			return new ImagePixel({
				id: this.id,
				imageData: options.imageData ?? this.imageData,
				x: options.x ?? this.x,
				y: options.y ?? this.y,
				style: options.style ?? this.style,
			});
		}
	}

	public override hitTest(point: Point): boolean {
		return false;
	}

	public override equals(other: ImagePixel): boolean {
		return (
			super.equals(other) &&
			this.imageData === other.imageData &&
			this.x === other.x &&
			this.y === other.y &&
			this.dx === other.dx &&
			this.dy === other.dy &&
			this.dw === other.dw &&
			this.dh === other.dh
		);
	}
}
