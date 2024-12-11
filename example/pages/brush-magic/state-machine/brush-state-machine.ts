import { FTouchdownEvent, FTouchmoveEvent } from "@/u-canvas-components/src/event";
import { BaseStateMachine } from "./base-state-machine";
import { Any } from "@/u-canvas";

export class BrushStateMachine extends BaseStateMachine {
	private any: Any | undefined;

	public onTouchdown(e: FTouchdownEvent) {
		const p = this.canvas.toGlobal([e.x, e.y]);
		this.any = new Any({ points: [p] });
		this.canvas.add(this.any);
		this.canvas.render();
	}

	public onTouchmove(e: FTouchmoveEvent) {
		const p = this.canvas.toGlobal([e.x, e.y]);
		this.any!.points.push(p);
		this.canvas.render();
	}
}
