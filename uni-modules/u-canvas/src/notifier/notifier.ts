import type { ValueSetter, VoidCallback } from "../types";

export type Callback<T> = T extends undefined ? VoidCallback : ValueSetter<T>;

export abstract class Notifier<T = undefined> {
	protected listeners: Callback<T>[] = [];

	public addListener(cb: Callback<T>): void {
		this.listeners.push(cb);
	}

	public removeListener(cb: Callback<T>): void {
		const index = this.listeners.indexOf(cb);
		if (index === -1) return;
		this.listeners.splice(index, 1);
	}

	public abstract notifyListeners(value?: T): void;
}
