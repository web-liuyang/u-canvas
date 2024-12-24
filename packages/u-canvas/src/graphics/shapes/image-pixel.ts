import type { GraphicOptions } from "../graphic";
import type { Point } from "../../types";
import type { Canvas } from "../../renderer";
import { Offset } from "../../offset";
import { Graphic } from "../graphic";
import { Aabb } from "../aabb";

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

	public imageData: ImageData;

	public x: number;

	public y: number;

	public dx: number;

	public dy: number;

	public dw: number;

	public dh: number;

	constructor(options: ImagePixelWithDirtyOptions);
	constructor(options: ImagePixelPureOptions);
	constructor(options: ImagePixelOptions) {
		super(options);

		this.imageData = options.imageData;
		this.x = options.x;
		this.y = options.y;
		this.dx = options?.dx ?? 0;
		this.dy = options?.dy ?? 0;
		this.dw = options?.dw ?? this.imageData.width;
		this.dh = options?.dh ?? this.imageData.height;
	}

	public override aabb(): Aabb {
		const [x, y] = this.matrix.applyVector(this.x, this.y);
		const aabb = Aabb.zero().offset(new Offset(x, y)).grow([this.dw, this.dh]);

		return aabb;
	}

	public override paint(canvas: Canvas, offset: Offset): void {
		const { imageData, dx, dy, dw, dh } = this;
		const [x, y] = [this.x + offset.dx, this.y + offset.dy];

		canvas.drawImagePixel(imageData, x, y, dx, dy, dw, dh);
	}

	// public override copyWith(options: CopyWithParameter<ImagePixelOptions>): ImagePixel {
	// 	const dx = options.dx ?? this.dx;
	// 	const dy = options.dy ?? this.dy;
	// 	const dw = options.dw ?? this.dw;
	// 	const dh = options.dh ?? this.dh;

	// 	if (dx !== undefined && dy !== undefined && dw !== undefined && dh !== undefined) {
	// 		return new ImagePixel({
	// 			id: this.id,
	// 			imageData: options.imageData ?? this.imageData,
	// 			x: options.x ?? this.x,
	// 			y: options.y ?? this.y,
	// 			dx,
	// 			dy,
	// 			dw,
	// 			dh,
	// 			style: options.style ?? this.style,
	// 		});
	// 	} else {
	// 		return new ImagePixel({
	// 			id: this.id,
	// 			imageData: options.imageData ?? this.imageData,
	// 			x: options.x ?? this.x,
	// 			y: options.y ?? this.y,
	// 			style: options.style ?? this.style,
	// 		});
	// 	}
	// }

	public override hitTest(point: Point): this | undefined {
		const [x, y] = point;
		const {
			imageData: { width, height },
		} = this;

		if (x >= this.x && x <= this.x + width && y >= this.y && y <= this.y + height) return this;

		return undefined;
	}

	// public override equals(other: ImagePixel): boolean {
	// 	return (
	// 		super.equals(other) &&
	// 		this.imageData === other.imageData &&
	// 		this.x === other.x &&
	// 		this.y === other.y &&
	// 		this.dx === other.dx &&
	// 		this.dy === other.dy &&
	// 		this.dw === other.dw &&
	// 		this.dh === other.dh
	// 	);
	// }
}
