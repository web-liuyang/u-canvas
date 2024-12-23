import { Canvas } from "../renderer/canvas";
import { Offset } from "../offset";
import { Transform } from "../transform";

export enum CoordinateScope {
	global,
	local,
}

/**
 * [x, y]
 */
export type Point = [number, number];

/**
 * [w, h]
 */
export type Size = [number, number];

/**
 * [sp, ep]
 */
export type Line = [Point, Point];

export interface Paintable {
	paint(canvas: Canvas, Offset: Offset): void;
}

export interface Hittable<T> {
	hitTest(point: Point): T;
}

export interface Parent<T> {
	parent?: T;
}

/**
 * P is parent type
 */
// export type Child = Paintable & Hittable & Transform; // & Equatable<unknown> & Parent;
