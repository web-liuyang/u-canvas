import { Container } from "../container";
import { Offset } from "../offset";

export enum CoordinateScope {
	global,
	local,
}

/**
 * [x, y]
 */
export type Point = [number, number];

/**
 * [sp, ep]
 */
export type Line = [Point, Point];

export interface Paintable {
	paint(ctx: CanvasRenderingContext2D, Offset: Offset): void;
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
export type Child = Paintable & Hittable & Equatable<unknown> & Parent;
