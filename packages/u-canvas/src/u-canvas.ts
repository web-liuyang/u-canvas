import type { Child, Point } from "./types";
import { Container } from "./container";
import { Renderer } from "./renderer";
import { Matrix } from "./transform";

export interface UCanvasOptions {
	canvasId: string;
	componentInstance?: any;
}

type Viewbox = [number, number, number, number];

export class UCanvas {
	public renderer: Renderer = new Renderer(this);

	public element!: UniCanvasElement;

	public canvasContext!: CanvasContext;

	public readonly dpr: number = uni.getDeviceInfo().devicePixelRatio || 1;

	public get ctx(): CanvasRenderingContext2D {
		const ctx = this.canvasContext.getContext("2d")!;
		// uniapp-x 并沒有提供 getTransform 方法，所以自己注入一个
		ctx.getTransform = () => this.root.matrix.toDOMMatrix();
		return ctx;
	}

	private _viewbox: Viewbox = [0, 0, 0, 0];

	public get viewbox(): Viewbox {
		return [...this._viewbox];
	}

	public get matrix(): Matrix {
		return this.root.matrix;
	}

	public set matrix(matrix: Matrix) {
		this.root.matrix = matrix;
		this.ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		this.setViewbox(matrix);
		this.render();
	}

	public root!: Container;

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

	private async getCanvasElement(options: UCanvasOptions): Promise<UniCanvasElement> {
		return uni.getElementById(options.canvasId) as UniCanvasElement;
	}

	// 处理高清屏逻辑
	private hidpi(element: UniCanvasElement, w: number, h: number, dpr: number) {
		element.width = w * dpr;
		element.height = h * dpr;
		// @ts-expect-error
		element.style.width = `${w}px`;
		// @ts-expect-error
		element.style.height = `${h}px`;
		this.ctx.scale(dpr, dpr);
	}

	public async ensureInitialize() {
		const canvasContext = await this.getCanvasContext(this.options);
		const element = await this.getCanvasElement(this.options);
		this.canvasContext = canvasContext;
		this.element = element;
		const window = uni.getWindowInfo();
		this.hidpi(element, window.windowWidth, window.windowHeight, this.dpr);
		this.root = new Container({ x: 0, y: 0 });
		this.root.matrix = new Matrix([this.dpr, 0, 0, this.dpr, 0, 0]);
		this.setViewbox(this.root.matrix);
	}

	private setViewbox(matrix: Matrix): void {
		const { width, height } = this.element;
		this._viewbox = [-matrix.e / matrix.a, -matrix.f / matrix.d, width / matrix.a, height / matrix.d];
	}

	public toGlobal(point: Point): Point {
		const [startX, startY] = this.viewbox;
		const { a, d } = this.matrix;
		const [x, y] = point;

		return [startX + (x * this.dpr) / a, startY + (y * this.dpr) / d];
	}

	public add(p: Child) {
		this.root.addChild(p);
	}

	private paintOrigin() {
		const path = new Path2D();
		path.moveTo(-50, 0);
		path.lineTo(50, 0);
		path.moveTo(0, -50);
		path.lineTo(0, 50);

		this.ctx.stroke(path);
	}

	public clear() {
		// console.log(...this._viewbox);
		this.ctx.clearRect(...this._viewbox);
		this.paintOrigin();
	}

	public render() {
		const matrix = this.root.matrix;
		this.ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
		this.setViewbox(matrix);

		this.clear();
		this.renderer.renderRoot();
	}
}
