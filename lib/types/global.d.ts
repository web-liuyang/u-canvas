/**
 * [x, y]
 */
declare type Point = [number, number];

declare type VoidFunction = () => void;

declare type ValueFunction<T> = (value: T) => void;

declare interface Paintable {
	paint(ctx: CanvasRenderingContext2D): void;
}

declare interface Cloneable<T> {
	copyWith(options: T): unknown;
}

declare interface Hittable {
	hitTest(point: Point): bool;
}

declare interface Equatable<T> {
	equals(other: T): boolean;
}

declare interface Parent<T> {
	parent?: T;
}
/**
 * P is parent type
 */
declare type Child<P> = Paintable & Hittable & Equatable<unknown> & Parent<P>;
