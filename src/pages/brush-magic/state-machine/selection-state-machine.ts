import { BaseStateMachine } from "./base-state-machine";
import { Matrix, Point } from "@/uni-modules/u-canvas/src";
import {
	PointerclickEvent,
	PointerdownEvent,
	PointermoveEvent,
	PointerupEvent,
	PointercancelEvent,
	PointerwheelEvent,
} from "@/uni-modules/u-pointer";

export class SelectionStateMachine extends BaseStateMachine {
	private originMatrix?: Matrix;
	// private originTouchInfo?: TouchInfo;

	public onpointerclick(e: PointerclickEvent): void {
		const point = this.canvas.toCanvasPoint(new Point(e.pointer.x, e.pointer.y));
		const hitTarget = this.canvas.root.hitTest(point);
	}

	public onpointerdown(e: PointerdownEvent): void {}

	public onpointermove(e: PointermoveEvent): void {
		const translate = this.canvas.matrix!.apply(Point.fromXY(e.pointer.delta));

		this.canvas.matrix.setTranslate(translate.x, translate.y);
		this.canvas.render();
	}

	public onpointerup(e: PointerupEvent): void {}

	public onpointercancel(e: PointercancelEvent): void {}

	public onpointerwheel(e: PointerwheelEvent): void {
		const point = this.canvas.toCanvasPoint(new Point(e.pointer.x, e.pointer.y));
		const factor = e.direction === "up" ? 1.1 : e.direction === "down" ? 0.9 : 1;
		this.canvas.matrix.scale(factor, factor, point);
		this.canvas.render();
	}
}
