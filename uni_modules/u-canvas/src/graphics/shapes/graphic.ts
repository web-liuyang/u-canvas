import type { EventTypeMap } from "u-pointer";
import type { Hittable, Paintable, Parent } from "../../types";
import type { Style } from "../styles";
import type { Point } from "../../offset";
import type { Canvas } from "../../renderer/canvas";
import type { Aabb } from "../aabb";
import type { UCanvas } from "../../u-canvas";
import { Offset } from "../../offset";
import { generateUUID } from "../utils";
import { Transform } from "../../transform";

export type GraphicId = string;

export interface GraphicOptions {
	id?: GraphicId;
	style?: Style;
	parent?: Graphic;
}

export abstract class Graphic<T extends GraphicOptions = GraphicOptions>
	extends Transform
	implements Paintable, Hittable<Graphic | undefined>, Parent<Graphic>
{
	public abstract readonly type: string;

	public readonly id: GraphicId;

	public offset: Offset = new Offset(0, 0);

	public style?: Style;

	/**
	 * 在调用 paint 之前注入
	 */
	public uCanvas?: UCanvas;

	public parent?: Graphic;

	constructor(options: T) {
		super();
		this.id = options.id ?? generateUUID();
		this.style = options.style;
		this.parent = options?.parent;
	}

	/**
	 * 自身 aabb
	 */
	public abstract getAabb(): Aabb;

	/**
	 * 全局 aabb
	 */
	public getGlobalAabb(): Aabb {
		return this.getAabb().offset(this.offset);
	}

	/**
	 * 绘制方法
	 * @param canvas 画布
	 * @param offset 全局偏移量
	 */
	public paint(canvas: Canvas, offset: Offset): void {
		this.offset = offset;
	}

	public abstract hitTest(point: Point): Graphic | undefined;

	public toGlobalPoint(point: Point): Point {
		return point.offset(this.offset);
	}

	private readonly listener: Map<keyof EventTypeMap, Array<(e: EventTypeMap[keyof EventTypeMap]) => void>> = new Map();

	public on<K extends keyof EventTypeMap>(eventName: K, callback: (e: EventTypeMap[K]) => void) {
		if (!this.listener.has(eventName)) {
			this.listener.set(eventName, []);
		}

		// @ts-expect-error TS 类型错误
		this.listener.get(eventName)!.push(callback);
	}

	public off<K extends keyof EventTypeMap>(eventName: K, callback: (e: EventTypeMap[K]) => void) {
		if (!this.listener.has(eventName)) return;

		const callbacks = this.listener.get(eventName)!;
		const index = callbacks.findIndex(cb => cb === callback);
		if (index < 0) return;
		callbacks.splice(index, 1);
	}

	public emit<K extends keyof EventTypeMap>(eventName: K, event: EventTypeMap[K]) {
		if (!this.listener.has(eventName)) return;

		const callbacks = this.listener.get(eventName)!;
		for (const callback of callbacks) {
			callback(event);
		}
	}
}
