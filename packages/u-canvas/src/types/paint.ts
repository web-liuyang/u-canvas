import { Canvas } from "../renderer/canvas";
import { Offset, Point } from "../offset";

/**
 * [w, h]
 */
// export type Size = [number, number];

export interface Paintable {
	paint(canvas: Canvas, Offset: Offset): void;
}

export interface Hittable<T> {
	hitTest(point: Point): T;
}

export interface Parent<T> {
	parent?: T;
}
