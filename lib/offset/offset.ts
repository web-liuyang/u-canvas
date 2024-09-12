import { OffsetBase } from "./offset-base";

export class Offset extends OffsetBase {
	/// Creates an offset. The first argument sets [dx], the horizontal component,
	/// and the second sets [dy], the vertical component.
	constructor(dx: number, dy: number) {
		super(dx, dy);
	}

	/// Creates an offset from its [direction] and [distance].
	///
	/// The direction is in radians clockwise from the positive x-axis.
	///
	/// The distance can be omitted, to create a unit vector (distance = 1.0).
	static fromDirection(direction: number, distance: number = 1.0): Offset {
		return new Offset(distance * Math.cos(direction), distance * Math.sin(direction));
	}

	/// The magnitude of the offset.
	///
	/// If you need this value to compare it to another [Offset]'s distance,
	/// consider using [distanceSquared] instead, since it is cheaper to compute.
	public get distance(): number {
		const { dx, dy } = this;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/// The square of the magnitude of the offset.
	///
	/// This is cheaper than computing the [distance] itself.
	public get distanceSquared(): number {
		const { dx, dy } = this;
		return Math.pow(dx, 2) + Math.pow(dy, 2);
	}

	/// The angle of this offset as radians clockwise from the positive x-axis, in
	/// the range -[pi] to [pi], assuming positive values of the x-axis go to the
	/// right and positive values of the y-axis go down.
	///
	/// Zero means that [dy] is zero and [dx] is zero or positive.
	///
	/// Values from zero to [pi]/2 indicate positive values of [dx] and [dy], the
	/// bottom-right quadrant.
	///
	/// Values from [pi]/2 to [pi] indicate negative values of [dx] and positive
	/// values of [dy], the bottom-left quadrant.
	///
	/// Values from zero to -[pi]/2 indicate positive values of [dx] and negative
	/// values of [dy], the top-right quadrant.
	///
	/// Values from -[pi]/2 to -[pi] indicate negative values of [dx] and [dy],
	/// the top-left quadrant.
	///
	/// When [dy] is zero and [dx] is negative, the [direction] is [pi].
	///
	/// When [dx] is zero, [direction] is [pi]/2 if [dy] is positive and -[pi]/2
	/// if [dy] is negative.
	///
	/// See also:
	///
	///  * [distance], to compute the magnitude of the vector.
	///  * [Canvas.rotate], which uses the same convention for its angle.
	public get direction(): number {
		const { dx, dy } = this;
		return Math.atan2(dy, dx);
	}

	/// An offset with zero magnitude.
	///
	/// This can be used to represent the origin of a coordinate space.
	static zero(): Offset {
		return new Offset(0.0, 0.0);
	}

	/// Returns a new offset with the x component scaled by `scaleX` and the y
	/// component scaled by `scaleY`.
	///
	/// If the two scale arguments are the same, consider using the `*` operator
	/// instead:
	///
	/// ```dart
	/// Offset a = const Offset(10.0, 10.0);
	/// Offset b = a * 2.0; // same as: a.scale(2.0, 2.0)
	/// ```
	///
	/// If the two arguments are -1, consider using the unary `-` operator
	/// instead:
	///
	/// ```dart
	/// Offset a = const Offset(10.0, 10.0);
	/// Offset b = -a; // same as: a.scale(-1.0, -1.0)
	/// ```
	public scale(scaleX: number, scaleY: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx * scaleX, dy * scaleY);
	}

	/// Returns a new offset with translateX added to the x component and
	/// translateY added to the y component.
	///
	/// If the arguments come from another [Offset], consider using the `+` or `-`
	/// operators instead:
	///
	/// ```dart
	/// Offset a = const Offset(10.0, 10.0);
	/// Offset b = const Offset(10.0, 10.0);
	/// Offset c = a + b; // same as: a.translate(b.dx, b.dy)
	/// Offset d = a - b; // same as: a.translate(-b.dx, -b.dy)
	/// ```
	public translate(translateX: number, translateY: number) {
		const { dx, dy } = this;
		return new Offset(dx + translateX, dy + translateY);
	}

	/// Unary negation operator.
	///
	/// Returns an offset with the coordinates negated.
	///
	/// If the [Offset] represents an arrow on a plane, this operator returns the
	/// same arrow but pointing in the reverse direction.
	public negated() {
		const { dx, dy } = this;
		return new Offset(-dx, -dy);
	}

	/// Binary subtraction operator.
	///
	/// Returns an offset whose [dx] value is the left-hand-side operand's [dx]
	/// minus the right-hand-side operand's [dx] and whose [dy] value is the
	/// left-hand-side operand's [dy] minus the right-hand-side operand's [dy].
	///
	/// See also [translate].
	public subtract(other: OffsetBase): Offset {
		const { dx, dy } = this;
		return new Offset(dx - other.dx, dy - other.dy);
	}

	/// Binary addition operator.
	///
	/// Returns an offset whose [dx] value is the sum of the [dx] values of the
	/// two operands, and whose [dy] value is the sum of the [dy] values of the
	/// two operands.
	///
	/// See also [translate].
	public add(other: OffsetBase): Offset {
		const { dx, dy } = this;
		return new Offset(dx + other.dx, dy + other.dy);
	}

	/// Multiplication operator.
	///
	/// Returns an offset whose coordinates are the coordinates of the
	/// left-hand-side operand (an Offset) multiplied by the scalar
	/// right-hand-side operand (a double).
	///
	/// See also [scale].
	public multiply(operand: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx * operand, dy * operand);
	}

	/// Division operator.
	///
	/// Returns an offset whose coordinates are the coordinates of the
	/// left-hand-side operand (an Offset) divided by the scalar right-hand-side
	/// operand (a double).
	///
	/// See also [scale].
	public divide(operand: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx / operand, dy / operand);
	}

	/// Integer (truncating) division operator.
	///
	/// Returns an offset whose coordinates are the coordinates of the
	/// left-hand-side operand (an Offset) divided by the scalar right-hand-side
	/// operand (a double), rounded towards zero.
	// Offset operator ~/(double operand) => Offset((dx ~/ operand).toDouble(), (dy ~/ operand).toDouble());

	/// Modulo (remainder) operator.
	///
	/// Returns an offset whose coordinates are the remainder of dividing the
	/// coordinates of the left-hand-side operand (an Offset) by the scalar
	/// right-hand-side operand (a double).
	public modulo(operand: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx % operand, dy % operand);
	}
}
