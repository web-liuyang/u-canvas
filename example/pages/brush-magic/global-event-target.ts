import {
	FTapEvent,
	FTouchcancelEvent,
	FTouchendEvent,
	FTouchmoveEvent,
	FTouchstartEvent,
	FZoominEvent,
	FZoomoutEvent,
} from "@/u-canvas-components/src/event";

export interface EventType {
	tap: FTapEvent;
	touchstart: FTouchstartEvent;
	touchmove: FTouchmoveEvent;
	touchend: FTouchendEvent;
	touchcancel: FTouchcancelEvent;
	zoomin: FZoominEvent;
	zoomout: FZoomoutEvent;
}

export type Listener<K extends keyof EventType> = (ev: EventType[K]) => Promise<void> | void;

class GlobalEventTarget {
	private listeners: Map<keyof EventType, Listener<any>[]> = new Map([
		["tap", []],
		["touchstart", []],
		["touchmove", []],
		["touchend", []],
		["touchcancel", []],
		["zoomin", []],
		["zoomout", []],
	]);

	public on<T extends keyof EventType>(type: T, cb: Listener<T>) {
		if (!this.listeners.has(type)) throw new Error(`no such event type: ${type}`);
		const ls = this.listeners.get(type) as Listener<T>[];
		ls.push(cb);
	}

	public off<T extends keyof EventType>(type: T, cb?: Listener<T>) {
		if (!this.listeners.has(type)) throw new Error(`no such event type: ${type}`);
		const ls = this.listeners.get(type) as Listener<T>[];
		if (!cb) {
			ls.length = 0;
		} else {
			const index = ls.indexOf(cb);
			if (index === -1) return;
			ls.splice(index, 1);
		}
	}

	public async emit<T extends keyof EventType>(type: T, value: EventType[T]) {
		if (!this.listeners.has(type)) throw new Error(`no such event type: ${type}`);
		const ls = this.listeners.get(type)! as Listener<T>[];

		for (const cb of ls) {
			await cb(value);
		}
	}
}

export const globalEventTarget = new GlobalEventTarget();
