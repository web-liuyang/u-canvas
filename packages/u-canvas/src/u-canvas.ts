import { Container } from "./container";
import { Offset } from "./offset";
import { Matrix } from "./transform";
import { Child, Point } from "./types";

export interface UCanvasOptions {
	canvasId: string;
	componentInstance?: any;
}

type Viewbox = [number, number, number, number];

export class UCanvas {
	protected element!: UniCanvasElement;

	protected canvasContext!: CanvasContext;

	public get ctx(): CanvasRenderingContext2D {
		// @ts-expect-error
		return this.element.getContext("2d")!;
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

	protected root!: Container;

	private options: UCanvasOptions;

	constructor(options: UCanvasOptions) {
		this.options = options;
	}

	private async getCanvasContext(options: UCanvasOptions): Promise<CanvasContext> {
		return new Promise((res: (context: CanvasContext) => void, rej) => {
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
		const devicePixelRatio = uni.getDeviceInfo().devicePixelRatio || 1;
		this.canvasContext = canvasContext;
		this.element = element;
		const window = uni.getWindowInfo();
		this.hidpi(element, window.windowWidth, window.windowHeight, devicePixelRatio);
		this.root = new Container({ x: 0, y: 0 });
		this.root.matrix = new Matrix([devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]);
	}

	private setViewbox(matrix: Matrix): void {
		const { width, height } = this.element;
		this._viewbox = [-matrix.e / matrix.a, -matrix.f / matrix.d, width / matrix.a, height / matrix.d];
	}

	public toGlobal(point: Point): Point {
		const [startX, startY] = this.viewbox;
		const { a, d } = this.matrix;
		const [x, y] = point;

		return [startX + x / a, startY + y / d];
	}

	public add(p: Child) {
		this.root.addChild(p);
	}

	public clear() {
		this.ctx.clearRect(...this._viewbox);
	}

	public render() {
		this.clear();

		this.root.paint(this.ctx, new Offset(0, 0));
	}
}
