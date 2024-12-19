import { FTouchdownEvent, FTouchmoveEvent } from "@/components/event";
import { BaseStateMachine } from "./base-state-machine";
import { Polyline } from "@u-canvas";

export class BrushStateMachine extends BaseStateMachine {
	private polyline: Polyline | undefined;

	public onTouchdown(e: FTouchdownEvent) {
		const p = this.canvas.toGlobal([e.x, e.y]);
		this.polyline = new Polyline({ points: [p, p] });
		this.canvas.add(this.polyline);
		this.canvas.render();
	}

	public onTouchmove(e: FTouchmoveEvent) {
		const p = this.canvas.toGlobal([e.x, e.y]);
		this.polyline!.points.push(p);
		this.canvas.render();
	}
}
