import type { Hittable, Paintable, Parent } from "../../types";
import type { Style } from "../styles";
import type { Point } from "../../offset";
import type { Canvas } from "../../renderer/canvas";
import type { Aabb } from "../aabb";
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

	// TODO Event
	// private readonly listener = new Map<keyof EventTypeMap, ((e: EventTypeMap[keyof EventTypeMap]) => void)[]>();

	// public on<K extends keyof EventTypeMap>(evnetName: K, callback: (e: EventTypeMap[K]) => void) {
	// 	if (!this.listener.has(evnetName)) return;
	// 	this.listener.get(evnetName)!.push(callback);
	// }

	// public off<K extends keyof EventTypeMap>(evnetName: K, callback: (e: EventTypeMap[K]) => void) {
	// 	if (!this.listener.has(evnetName)) return;
	// 	const index = this.listener.get(evnetName)!.findIndex(cb => cb === callback);
	// 	if (index < 0) return;
	// 	this.listener.get(evnetName)!.slice(index, 1);
	// }
}
