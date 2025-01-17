import {
	PointerclickEvent,
	PointerdownEvent,
	PointermoveEvent,
	PointerupEvent,
	PointercancelEvent,
	PointerwheelEvent,
} from "@/uni_modules/u-pointer";
import type { UCanvas } from "@/uni_modules/u-canvas/src";

export abstract class BaseStateMachine {
	constructor(protected canvas: UCanvas) {}

	public onpointerclick(e: PointerclickEvent): void {}

	public onpointerdown(e: PointerdownEvent): void {}

	public onpointermove(e: PointermoveEvent): void {}

	public onpointerup(e: PointerupEvent): void {}

	public onpointercancel(e: PointercancelEvent): void {}

	public onpointerwheel(e: PointerwheelEvent): void {}
}
