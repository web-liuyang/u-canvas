import { BaseStateMachine } from "./base-state-machine";
import { Matrix, Point } from "u-canvas";
import {
	PointerclickEvent,
	PointerdownEvent,
	PointermoveEvent,
	PointerupEvent,
	PointercancelEvent,
	PointerwheelEvent,
} from "u-pointer";

export class SelectionStateMachine extends BaseStateMachine {
	public override onpointerclick(e: PointerclickEvent): void {
		const point = this.canvas.toCanvasPoint(new Point(e.pointer.x, e.pointer.y));
		const hitTarget = this.canvas.root.hitTest(point);
	}

	public override onpointerdown(e: PointerdownEvent): void {
		console.log("onpointerdown");
	}

	public override onpointermove(e: PointermoveEvent): void {
		const translate = this.canvas.matrix!.apply(Point.fromXY(e.pointer.delta));

		this.canvas.matrix.setTranslate(translate.x, translate.y);
		this.canvas.render();
	}

	public override onpointerup(e: PointerupEvent): void {}

	public override onpointercancel(e: PointercancelEvent): void {}

	public override onpointerwheel(e: PointerwheelEvent): void {
		const point = this.canvas.toCanvasPoint(new Point(e.pointer.x, e.pointer.y));
		const factor = e.direction === "up" ? 1.1 : e.direction === "down" ? 0.9 : 1;
		this.canvas.matrix.scale(factor, factor, point);
		this.canvas.render();
	}
}
