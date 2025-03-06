import { OffsetBase } from "./offset-base";

export class Offset extends OffsetBase {
	static fromDirection(direction: number, distance: number = 1.0): Offset {
		return new Offset(distance * Math.cos(direction), distance * Math.sin(direction));
	}

	static zero(): Offset {
		return new Offset(0.0, 0.0);
	}

	constructor(dx: number, dy: number) {
		super(dx, dy);
	}

	public get distance(): number {
		const { dx, dy } = this;
		return Math.sqrt(dx * dx + dy * dy);
	}

	public get distanceSquared(): number {
		const { dx, dy } = this;
		return Math.pow(dx, 2) + Math.pow(dy, 2);
	}

	public get direction(): number {
		const { dx, dy } = this;
		return Math.atan2(dy, dx);
	}

	public scale(scaleX: number, scaleY: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx * scaleX, dy * scaleY);
	}

	public translate(translateX: number, translateY: number) {
		const { dx, dy } = this;
		return new Offset(dx + translateX, dy + translateY);
	}

	public negated() {
		const { dx, dy } = this;
		return new Offset(-dx, -dy);
	}

	public subtract(other: OffsetBase): Offset {
		const { dx, dy } = this;
		return new Offset(dx - other.dx, dy - other.dy);
	}

	public add(other: OffsetBase): Offset {
		const { dx, dy } = this;
		return new Offset(dx + other.dx, dy + other.dy);
	}

	public multiply(operand: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx * operand, dy * operand);
	}

	public divide(operand: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx / operand, dy / operand);
	}

	public modulo(operand: number): Offset {
		const { dx, dy } = this;
		return new Offset(dx % operand, dy % operand);
	}
}
