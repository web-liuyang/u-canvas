import type { Graphic, ImageResource, Style } from "./graphics";
import { Point } from "./offset";
import { Composition, defaultStyle, repeatArray } from "./graphics";
import { applyStyle, Renderer } from "./renderer";
import { Matrix } from "./transform";

export interface CreateImageDataOptions {
	data: Uint8ClampedArray;
	bytesPerScanline: number;
	// TODO
	// color: any;
	/**
	 * Array [Col, Row]. default [1, 1]
	 */
	array?: [number, number];
}

export interface UCanvasOptions {
	canvasId: string;
	componentInstance?: any;
}

export type Viewbox = [number, number, number, number];

export class UCanvas {
	public renderer: Renderer = new Renderer(this);

	public canvasContext!: CanvasContext;

	public readonly dpr: number = uni.getDeviceInfo().devicePixelRatio || 1;

	public style: Style = defaultStyle;

	public ctx!: CanvasRenderingContext2D;

	private _viewbox: Viewbox = [0, 0, 0, 0];

	public get viewbox(): Viewbox {
		return [...this._viewbox];
	}

	public get matrix(): Matrix {
		return this.root.matrix;
	}

	public set matrix(matrix: Matrix) {
		this.ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		this.root.matrix = matrix;
	}

	public root!: Composition;

	public options: UCanvasOptions;

	constructor(options: UCanvasOptions) {
		this.options = options;
	}

	private async getCanvasContext(options: UCanvasOptions): Promise<CanvasContext> {
		return new Promise<CanvasContext>((res, rej) => {
			const { canvasId, componentInstance } = options;
			uni.createCanvasContextAsync({
				id: canvasId,
				component: componentInstance,
				success: res,
				fail: rej,
			});
		});
	}

	// 处理高清屏逻辑
	private hidpi(ctx: CanvasRenderingContext2D, dpr: number) {
		// 兼容小程序
		ctx.canvas.width = ctx.canvas.offsetWidth * dpr;
		ctx.canvas.height = ctx.canvas.offsetHeight * dpr;
		ctx.scale(this.dpr, this.dpr);
	}

	public async ensureInitialize() {
		const canvasContext = await this.getCanvasContext(this.options);
		this.canvasContext = canvasContext;
		this.ctx = this.canvasContext.getContext("2d")!;
		this.mixinCanvasMethod();
		this.hidpi(this.ctx, this.dpr);
		this.root = new Composition({ x: 0, y: 0 });
		this.root.matrix = new Matrix([this.dpr, 0, 0, this.dpr, 0, 0]);
		this.setViewbox(this.root.matrix);
	}

	private mixinCanvasMethod() {
		// uniapp-x 并沒有提供 getTransform 方法
		// 注入 set/getMatrix
		this.ctx.getMatrix = () => this.root.matrix.clone();
		this.ctx.setMatrix = (matrix: Matrix) => {
			this.ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
			this.root.matrix = matrix;
		};
		this.ctx.createCompatibleImageData = (data: Uint8ClampedArray, w: number, h: number) => {
			// #ifdef APP
			// Web 有跨源问题
			// @ts-expect-error Uni 条件编译
			const imageData: ImageData = this.ctx.getImageData(0, 0, w, h);
			// #endif

			// #ifdef WEB || MP
			// 有Android/iOS不支持
			// @ts-expect-error Uni 条件编译
			const imageData: ImageData = this.ctx.createImageData(w, h);
			// #endif

			imageData.data.set(data);
			return imageData;
		};
	}

	private setViewbox(matrix: Matrix): void {
		const { width, height } = this.ctx.canvas;
		this._viewbox = [-matrix.e / matrix.a, -matrix.f / matrix.d, width / matrix.a, height / matrix.d];
	}

	/**
	 * 窗口坐标转成 Canvas 中的坐标
	 * @param point 窗口坐标
	 * @returns Canvas 中的坐标
	 */
	public toCanvasPoint(point: Point): Point {
		const [startX, startY] = this.viewbox;
		const { a, d } = this.matrix;

		return new Point(startX + (point.x * this.dpr) / a, startY + (point.y * this.dpr) / d);
	}

	public add(p: Graphic) {
		this.root.addChild(p);
	}

	public remove(p: Graphic) {
		this.root.removeChild(p);
	}

	public clearChildren() {
		this.root.clearChildren();
	}

	public clearCanvas() {
		this.ctx.clearRect(...this._viewbox);
	}

	// private paintOrigin() {
	// 	const path = this.canvasContext.createPath2D();
	// 	path.moveTo(-50, 0);
	// 	path.lineTo(50, 0);
	// 	path.moveTo(0, -50);
	// 	path.lineTo(0, 50);

	// 	path.arc(50, 50, 20, 0, 2 * Math.PI);

	// 	this.ctx.stroke(path);
	// }

	public clear() {
		this.ctx.clearRect(...this._viewbox);
		// this.paintOrigin();
	}

	public render() {
		const matrix = this.root.matrix;
		this.ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		this.setViewbox(matrix);
		this.clear();
		applyStyle(this.ctx, this.style);

		this.renderer.renderRoot();
	}

	public createImage(src: string): Promise<ImageResource> {
		return new Promise<any>((resolve, reject) => {
			// TODO 后面会换成请求不用等待 onload , 直接就可以渲染做成同步处理
			// 目前图片路径是不能有问题的, 要不然就会卡住
			const image = this.canvasContext.createImage();
			image.src = src;
			image.onload = () => {
				resolve(image);
			};
		});
	}

	public createImageData(options: CreateImageDataOptions): ImageData {
		const { data, bytesPerScanline, array = [1, 1] } = options;

		const [col, row] = array;
		const w = bytesPerScanline;
		const h = data.length;
		const pixels = new Uint8ClampedArray(col * w * h * 4);
		const dataView = new DataView(pixels.buffer);

		for (let i = 0, len = dataView.byteLength; i < len; i += col * w * 4) {
			const bitmask = data[i / (col * w * 4)];
			let offset = i;

			for (let c = 0; c < col; c++) {
				for (let n = bytesPerScanline - 1; n >= 0; n--) {
					const alpha = ((1 << n) & bitmask) !== 0 ? 255 : 0;
					dataView.setUint8(offset + 0, 0);
					dataView.setUint8(offset + 1, 0);
					dataView.setUint8(offset + 2, 0);
					dataView.setUint8(offset + 3, alpha);
					offset += 4;
				}
			}
		}

		const repeatedPixels = repeatArray(pixels, row);
		const imageData = this.ctx.createCompatibleImageData(repeatedPixels, w * col, h * row);
		return imageData;
	}
}

declare global {
	interface CanvasTransform {
		getMatrix(): Matrix;
		setMatrix(matrix: Matrix): void;

		createCompatibleImageData(data: Uint8ClampedArray, w: number, h: number): ImageData;
	}
}
