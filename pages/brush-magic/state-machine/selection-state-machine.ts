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
} from "@/components/event";
import type { TouchInfo } from "@/components/event";

import { BaseStateMachine } from "./base-state-machine";
import { Matrix, Point } from "u-canvas";

export class SelectionStateMachine extends BaseStateMachine {
	private originMatrix?: Matrix;
	private originTouchInfo?: TouchInfo;

	public onTouchdown(e: FTouchdownEvent): void {
		// console.log("A");
	}

	public onTouchup(e: FTouchupEvent): void {
		const point = this.canvas.toCanvasPoint(new Point(e.x, e.y));
		// console.log(point);
		const hitTarget = this.canvas.root.hitTest(point);
		// console.log(hitTarget?.type);
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
		const point = this.canvas.toCanvasPoint(new Point(e.x, e.y));
		this.canvas.matrix.scale(1.1, 1.1, point);
		this.canvas.render();
	}

	public onZoomout(e: FZoomoutEvent) {
		const point = this.canvas.toCanvasPoint(new Point(e.x, e.y));
		this.canvas.matrix.scale(0.9, 0.9, point);
		this.canvas.render();
	}
}
