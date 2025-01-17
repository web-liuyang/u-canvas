import type { EventTypeMap } from "./pointer-events";

export class PointerListener {
	private _listeners = new Map<keyof EventTypeMap, ((e: EventTypeMap[keyof EventTypeMap]) => void)[]>();

	public addEventListener<K extends keyof EventTypeMap>(type: K, listener: (e: EventTypeMap[K]) => void) {
		if (!this._listeners.has(type)) this._listeners.set(type, []);
		// @ts-expect-error TS 没有推导出此类型，属于TS问题
		this._listeners.get(type)!.push(listener);
	}

	public removeEventListener<K extends keyof EventTypeMap>(type: K, listener: (e: EventTypeMap[K]) => void) {
		if (!this._listeners.has(type)) return;
		const index = this._listeners.get(type)!.findIndex(cb => cb === listener);
		if (index < 0) return;
		this._listeners.get(type)!.splice(index, 1);
	}

	public notify<K extends keyof EventTypeMap>(type: K, event: EventTypeMap[K]) {
		if (!this._listeners.has(type)) return;
		for (const listener of this._listeners.get(type)!) {
			listener(event);
		}
	}
}

export const pointerListener = new PointerListener();
