import {
	FTapEvent,
	FTouchcancelEvent,
	FTouchdownEvent,
	FTouchendEvent,
	FTouchmoveEvent,
	FTouchstartEvent,
	FTouchupEvent,
	FZoominEvent,
	FZoomoutEvent,
	TouchInfo,
} from "@/u-canvas-components/src/event";
import { BaseStateMachine } from "./base-state-machine";
import { Matrix } from "@/u-canvas";

export class SelectionStateMachine extends BaseStateMachine {
	private originMatrix?: Matrix;
	private originTouchInfo?: TouchInfo;

	public onTouchdown(e: FTouchdownEvent): void {
		// console.log("A");
	}

	public onTouchup(e: FTouchupEvent): void {
		// console.log("B");
	}

	public onTouchstart(e: FTouchstartEvent) {
		this.originMatrix = this.canvas.matrix.clone();
		this.originTouchInfo = e.touchInfo;
	}

	public onTouchmove(e: FTouchmoveEvent) {
		const [deltaX, deltaY] = [e.x - this.originTouchInfo!.x, e.y - this.originTouchInfo!.y];

		const tx = this.originMatrix!.e + deltaX * this.canvas.dpr;
		const ty = this.originMatrix!.f + deltaY * this.canvas.dpr;

		this.canvas.matrix.setTranslate(tx, ty);
		this.canvas.render();
	}

	public onTouchend(e: FTouchendEvent) {
		this.originMatrix = undefined;
		this.originTouchInfo = undefined;
	}

	public onTouchcancel(e: FTouchcancelEvent) {
		this.originMatrix = undefined;
		this.originTouchInfo = undefined;
	}

	public onZoomin(e: FZoominEvent) {
		const [x, y] = this.canvas.toGlobal([e.x, e.y]);
		const matrix = this.canvas.matrix.scale(1.1, 1.1, [x, y]);
		this.canvas.matrix = matrix;
	}

	public onZoomout(e: FZoomoutEvent) {
		const [x, y] = this.canvas.toGlobal([e.x, e.y]);
		const matrix = this.canvas.matrix.scale(0.9, 0.9, [x, y]);
		this.canvas.matrix = matrix;
	}
}
