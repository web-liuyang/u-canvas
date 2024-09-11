import { Graphic } from "./graphics";

export interface UCanvasOptions {
	canvasId: string;
	componentInstance: any;
}

export class UCanvas {
	protected element!: UniCanvasElement;

	public get ctx(): CanvasRenderingContext2D {
		// @ts-expect-error
		return this.element.getContext("2d")!;
	}

	private graphics: Graphic[] = [];

	private options: UCanvasOptions;

	constructor(options: UCanvasOptions) {
		this.options = options;
	}

	private async getCanvasElement(options: UCanvasOptions): Promise<UniCanvasElement> {
		const { canvasId } = options;
		const canvas = uni.getElementById(canvasId) as UniCanvasElement;
		return canvas;

		// HBuilderX 4.25+
		// 异步调用方式, 跨平台写法
		// const { canvasId, componentInstance } = options;
		// uni.createCanvasContextAsync({
		// 	id: canvasId,
		// 	component: componentInstance,
		// 	success: (canvasContext) => {
		// 		this.ctx = canvasContext.getContext('2d')!;
		// 		const canvas = canvasContext.canvas;
		// 		console.log(canvas);
		// 		// 处理高清屏逻辑
		// 		const dpr = uni.getDeviceInfo().devicePixelRatio ?? 1;
		// 		canvas.width = canvas.offsetWidth * dpr;
		// 		canvas.height = canvas.offsetHeight * dpr;
		// 		canvas.scale(dpr, dpr); // 仅需调用一次，当调用 reset 方法后需要再次 scale
		// 	},
		// 	fail: (error) => {
		// 		console.log("ERROR: ", error);
		// 	}
		// });
	}

	// 处理高清屏逻辑
	private resetRatio(dpr: number = 1) {
		this.element.width = this.element.offsetWidth * dpr;
		this.element.height = this.element.offsetHeight * dpr;

		this.ctx.scale(dpr, dpr);
	}

	public async ensureInitialize() {
		const element = await this.getCanvasElement(this.options);
		this.element = element;
		this.resetRatio(uni.getDeviceInfo().devicePixelRatio);
	}

	public add(g: Graphic) {
		this.graphics.push(g);
	}

	public clear() {
		// this.ctx.clearRect();
	}

	public render() {
		this.clear();

		for (const g of this.graphics) {
			g.paint(this.ctx);
		}
	}
}
