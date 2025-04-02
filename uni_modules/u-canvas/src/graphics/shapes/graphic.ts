import type { Style } from "../styles";
import type { Point } from "../../coords";
import type { Canvas } from "../../renderer/canvas";
import type { Aabb } from "../aabb";
import type { UCanvas } from "../../u-canvas";
import { Offset } from "../../coords";
import { generateUUID } from "../utils";
import { Matrix, multiply } from "../../transform";

export type GraphicId = string;

export interface GraphicOptions {
	id?: GraphicId;
	style?: Style;
	parent?: Graphic;
}

export abstract class Graphic<T extends GraphicOptions = GraphicOptions> {
	public abstract readonly type: string;

	/**
	 * id
	 */
	public readonly id: GraphicId;
	/**
	 * 全局偏移量
	 */
	public offset: Offset = new Offset(0, 0);

	/**
	 * 样式
	 */
	public style?: Style;

	/**
	 * 在调用 paint 之前注入的 uCanvas 实例
	 */
	public uCanvas?: UCanvas;

	/**
	 * 父图形
	 */
	public parent?: Graphic;

	/**
	 * 局部矩阵
	 */
	public matrix: Matrix = new Matrix();

	/**
	 * 全局矩阵
	 */
	get worldMatrix() {
		const parentWorldMatrix = this.parent?.worldMatrix ?? new Matrix();
		const worldMatrix = multiply(parentWorldMatrix, this.matrix);
		return worldMatrix;
	}

	constructor(options: T) {
		this.id = options.id ?? generateUUID();
		this.style = options.style;
		this.parent = options?.parent;
	}

	/**
	 * 自身 aabb
	 * @returns
	 */
	public abstract getAabb(): Aabb;

	/**
	 * 全局 aabb
	 * @returns
	 */
	public getGlobalAabb(): Aabb {
		return this.getAabb().offseted(this.offset);
	}

	/**
	 * 绘制
	 * @param canvas 画布
	 * @param offset 全局偏移量
	 */
	public paint(canvas: Canvas, offset: Offset): void {
		this.offset = offset;
	}

	/**
	 * 命中测试
	 * @param point 全局坐标点
	 * @returns
	 */
	public abstract hitTest(point: Point): Graphic | undefined;

	/**
	 * 将局部坐标点转化为全局坐标点
	 * @param point 局部坐标点
	 * @returns
	 */
	public toGlobalPoint(point: Point): Point {
		return point.offseted(this.offset);
	}
}
