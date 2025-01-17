import type { Canvas } from "../renderer/canvas";
import type { Offset, Point } from "../offset";

export interface Paintable {
	paint(canvas: Canvas, Offset: Offset): void;
}

export interface Hittable<T> {
	hitTest(point: Point): T;
}

export interface Parent<T> {
	parent?: T;
}

export type ValueSetter<T> = (value: T) => void;

export type ValueGetter<T> = () => T;

export type VoidCallback = () => void;
