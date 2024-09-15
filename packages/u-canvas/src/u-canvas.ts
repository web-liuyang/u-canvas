import { Container } from "./container";
import { Offset } from "./offset";
import { Matrix } from "./transform";
import { Child } from "./types";

export interface UCanvasOptions {
	canvasId: string;
	componentInstance?: any;
}

export class UCanvas {
	protected element!: UniCanvasElement;

	protected canvasContext!: CanvasContext;

	public get ctx(): CanvasRenderingContext2D {
		// @ts-expect-error
		return this.element.getContext("2d")!;
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
	private resetRatio(element: UniCanvasElement, w: number, h: number, dpr: number) {
		element.width = w * dpr;
		element.height = h * dpr;
		// @ts-expect-error
		element.style.width = `${w}px`;
		// @ts-expect-error
		element.style.height = `${h}px`;
	}

	public async ensureInitialize() {
		const canvasContext = await this.getCanvasContext(this.options);
		const element = await this.getCanvasElement(this.options);
		const devicePixelRatio = uni.getDeviceInfo().devicePixelRatio || 1;
		this.canvasContext = canvasContext;
		this.element = element;
		const window = uni.getWindowInfo();
		this.resetRatio(element, window.windowWidth, window.windowHeight, devicePixelRatio);
		this.root = new Container({
			x: 0,
			y: 100,
		});

		this.root.matrix = new Matrix([devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]);
	}

	public add(p: Child) {
		this.root.addChild(p);
	}

	public clear() {
		// this.ctx.clearRect();
	}

	public render() {
		this.clear();

		this.root.paint(this.ctx, new Offset(0, 0));
	}
}
