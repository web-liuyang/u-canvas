import type {
	FTapEvent,
	FTouchstartEvent,
	FTouchmoveEvent,
	FTouchendEvent,
	FTouchcancelEvent,
	FZoominEvent,
	FZoomoutEvent,
} from "@/u-canvas-components/src/event";
import { UCanvas } from "@/u-canvas";

export abstract class BaseStateMachine {
	constructor(protected canvas: UCanvas) {}

	public onTap(e: FTapEvent): void {}
	public onTouchstart(e: FTouchstartEvent): void {}
	public onTouchmove(e: FTouchmoveEvent): void {}
	public onTouchend(e: FTouchendEvent): void {}
	public onTouchcancel(e: FTouchcancelEvent): void {}
	public onZoomin(e: FZoominEvent): void {}
	public onZoomout(e: FZoomoutEvent): void {}
}
