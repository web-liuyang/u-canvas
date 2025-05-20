import type { Graphic, ImageResource, Style } from "./graphics";
import { Point } from "./coords";
import { Composition, defaultStyle, repeatArray } from "./graphics";
import { applyStyle, Renderer } from "./renderer";
import { Matrix } from "./transform";

export interface MakeImageDataOptions {
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

/**
 * Viewbox = [x, y, w, h]
 */
export type Viewbox = [number, number, number, number];

export class UCanvas {
	/**
	 * Canvas 上下文
	 */
	public canvasContext!: CanvasContext;

	/**
	 * 原生绘制属性
	 */
	public ctx!: CanvasRenderingContext2D;

	/**
	 * 屏幕像素比
	 */
	public dpr: number = uni.getWindowInfo().pixelRatio;

	/**
	 * 初始化状态
	 */
	public isInitialized: boolean = false;

	/**
	 * 构造参数
	 */
	public options: UCanvasOptions;

	/**
	 * 渲染类
	 */
	public renderer: Renderer = new Renderer(this);

	/**
	 * 根图形
	 */
	public readonly root: Composition = new Composition({ x: 0, y: 0 });

	/**
	 * 绘制样式
	 */
	public style: Style = defaultStyle;

	private _viewbox: Viewbox = [0, 0, 0, 0];

	/**
	 * 可视区域
	 */
	public get viewbox(): Viewbox {
		return [...this._viewbox];
	}

	/**
	 * 获取当前画布矩阵
	 */
	public get matrix(): Matrix {
		return this.root.matrix;
	}

	/**
	 * 设置当前画布矩阵
	 */
	public set matrix(matrix: Matrix) {
		this.ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		this.root.matrix = matrix;
	}

	constructor(options: UCanvasOptions) {
		this.options = options;
	}

	/**
	 * 初始化 Canvas
	 */
	public async ensureInitialize(): Promise<void> {
		if (this.isInitialized) return;
		const canvasContext = await this.getCanvasContext(this.options);
		this.canvasContext = canvasContext;
		this.ctx = this.canvasContext.getContext("2d")!;
		this.mixinCanvasMethod();
		this.hidpi(this.ctx, this.dpr);
		this.root.matrix = new Matrix([this.dpr, 0, 0, this.dpr, 0, 0]);
		this.setViewbox(this.root.matrix);
		this.isInitialized = true;
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

	/** 处理高清屏逻辑 */
	private hidpi(ctx: CanvasRenderingContext2D, dpr: number): void {
		// 兼容小程序
		ctx.canvas.width = ctx.canvas.offsetWidth * dpr;
		ctx.canvas.height = ctx.canvas.offsetHeight * dpr;
		ctx.scale(this.dpr, this.dpr);
	}

	/**
	 * 混入 canvas 方法
	 */
	private mixinCanvasMethod(): void {
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
			// Android/iOS不支持 createImageData
			// @ts-expect-error Uni 条件编译
			const imageData: ImageData = this.ctx.createImageData(w, h);
			// #endif

			imageData.data.set(data);
			return imageData;
		};
	}

	/**
	 * 设置当前可视区域
	 * @param matrix Matrix
	 * @returns
	 */
	private setViewbox(matrix: Matrix): void {
		const { width, height } = this.ctx.canvas;
		this._viewbox = [-matrix.e / matrix.a, -matrix.f / matrix.d, width / matrix.a, height / matrix.d];
	}

	/**
	 * 屏幕坐标转成 Canvas 中的坐标
	 * @param point 屏幕坐标
	 * @returns Canvas 中的坐标
	 */
	public toCanvasPoint(point: Point): Point {
		const [startX, startY] = this.viewbox;
		const { a, d } = this.matrix;

		return new Point(startX + (point.x * this.dpr) / a, startY + (point.y * this.dpr) / d);
	}

	/**
	 * 添加图形
	 * @param graphic 图形
	 * @returns
	 */
	public addGraphic(graphic: Graphic): void {
		return this.root.addChild(graphic);
	}

	/**
	 * 删除图形
	 * @param graphic 图形
	 * @returns
	 */
	public removeGraphic(graphic: Graphic): void {
		return this.root.removeChild(graphic);
	}

	/**
	 * 清除所有图形
	 */
	public cleanGraphic(): void {
		return this.root.clearChildren();
	}

	/**
	 * 清除当前画布内容
	 */
	public cleanCanvas(): void {
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

	/**
	 * 渲染
	 */
	public render(): void {
		const matrix = this.root.matrix;
		this.ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		this.setViewbox(matrix);
		this.cleanCanvas();
		applyStyle(this.ctx, this.style);

		this.renderer.renderRoot();
	}

	/**
	 * 创建 ImageResource
	 * @param src 路径
	 * @returns
	 */
	public createImageResource(src: string): Promise<ImageResource> {
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

	/**
	 * 制作 ImageData
	 * @param options 参数
	 * @returns
	 */
	public makeImageData(options: MakeImageDataOptions): ImageData {
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

	/**
	 * 返回一个包含图片展示的 data URI
	 * @param type 类型
	 * @param quality 质量
	 */
	public async toBlob(type?: string, quality?: number): Promise<Blob> {
		return new Promise<Blob>((resolve, reject) => {
			try {
				this.canvasContext.toBlob(resolve, type, quality);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * 返回当前画布可视区域的 base64 图片
	 */
	public toDataURL(): string {
		return this.canvasContext.toDataURL();
	}

	/**
	 * 在下一次重绘之前，调用用户提供的回调函数
	 * @param callback 回调函数
	 * @returns
	 */
	public requestAnimationFrame(callback: RequestAnimationFrameCallback): number {
		return this.canvasContext.requestAnimationFrame(callback);
	}

	/**
	 * 取消一个先前通过调用 uni.requestAnimationFrame() 方法添加到计划中的动画帧请求
	 * @param taskId
	 */
	public cancelAnimationFrame(taskId: number): void {
		this.canvasContext.cancelAnimationFrame(taskId);
	}
}

declare global {
	interface CanvasTransform {
		getMatrix(): Matrix;
		setMatrix(matrix: Matrix): void;

		createCompatibleImageData(data: Uint8ClampedArray, w: number, h: number): ImageData;
	}
}
