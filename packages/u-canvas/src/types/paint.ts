import { Container } from "../container";
import { Canvas } from "../renderer/canvas";
import { Offset } from "../offset";
import { Transform } from "../transform";
import { Paint } from "../u-paint";

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

export interface Cloneable<T> {
	copyWith(options: T): unknown;
}

export interface Hittable {
	hitTest(point: Point): boolean;
}

export interface Equatable<T> {
	equals(other: T): boolean;
}

export interface Parent {
	parent?: Container;
}

/**
 * P is parent type
 */
export type Child = Paintable & Hittable & Equatable<unknown> & Parent & Transform;
