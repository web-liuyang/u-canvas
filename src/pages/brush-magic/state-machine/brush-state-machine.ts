import { BaseStateMachine } from "./base-state-machine";
import { Point, Polyline } from "u-canvas";
import { PointerdownEvent, PointermoveEvent } from "u-pointer";

export class BrushStateMachine extends BaseStateMachine {
	private polyline: Polyline | undefined;

	public onpointerdown(e: PointerdownEvent) {
		const p = this.canvas.toCanvasPoint(Point.fromXY(e.pointer));
		this.polyline = new Polyline({ points: [p, p] });
		this.canvas.add(this.polyline);
		this.canvas.render();
	}

	public onpointermove(e: PointermoveEvent) {
		const p = this.canvas.toCanvasPoint(Point.fromXY(e.pointer));
		this.polyline!.points.push(p);
		this.canvas.render();
	}
}
