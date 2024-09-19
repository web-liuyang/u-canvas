import { Point } from "../types";
import { multiply } from "./utils";

/**
 * Matrix Array Type
 * a, b, c, d, e, f
 */
export type MatrixArray = [number, number, number, number, number, number];

export enum MultiplicativeDirection {
	Right,
	Left,
}

export class Matrix {
	public a: number;

	public b: number;

	public c: number;

	public d: number;

	public e: number;

	public f: number;

	get matrixArray(): MatrixArray {
		return [this.a, this.b, this.c, this.d, this.e, this.f];
	}

	static fromDOMMatrix(matrix: DOMMatrix): Matrix {
		return new Matrix([matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]);
	}

	constructor(matrixArray: MatrixArray = [1, 0, 0, 1, 0, 0]) {
		this.a = matrixArray[0];
		this.b = matrixArray[1];
		this.c = matrixArray[2];
		this.d = matrixArray[3];
		this.e = matrixArray[4];
		this.f = matrixArray[5];
	}

	/**
	 * Matrix multiplication matrix
	 */
	public multiply(other: Matrix, direction: MultiplicativeDirection = MultiplicativeDirection.Right): Matrix {
		switch (direction) {
			case MultiplicativeDirection.Left:
				return multiply(this, other);
			case MultiplicativeDirection.Right:
				return multiply(other, this);
		}
	}

	/**
	 * Matrix multiplication vector
	 */
	public applyVector(vector: Point): Point {
		const [x, y] = vector;

		const x1 = this.a * x + this.c * y + this.e;
		const y1 = this.b * x + this.d * y + this.f;

		return [x1, y1];
	}

	public translate(tx: number, ty: number): Matrix {
		const translationMatrix = new Matrix([1, 0, 0, 1, tx, ty]);
		const matrix = this.multiply(translationMatrix);
		return matrix;
	}

	public rotate(theta: number): Matrix {
		const cos = Math.cos(theta);
		const sin = Math.sin(theta);
		const rotationMatrix = new Matrix([cos, -sin, sin, cos, 0, 0]);
		const matrix = this.multiply(rotationMatrix);
		return matrix;
	}

	public setTranslate(tx: number, ty: number): Matrix {
		const matrix = new Matrix([this.a, this.b, this.c, this.d, tx, ty]);
		return matrix;
	}

	/**
	 * Scale
	 *
	 * At locate [point] scale, if the [point] exist.
	 */
	public scale(a: number, d: number, point?: Point): Matrix {
		let matrix: Matrix;
		if (point) {
			const [x, y] = point;
			matrix = this.multiply(new Matrix([1, 0, 0, 1, x, y]), MultiplicativeDirection.Left)
				.multiply(new Matrix([a, 0, 0, d, 0, 0]), MultiplicativeDirection.Left)
				.multiply(new Matrix([1, 0, 0, 1, -x, -y]), MultiplicativeDirection.Left);
		} else {
			matrix = this.multiply(new Matrix([a, 0, 0, d, 0, 0]));
		}

		return matrix;
	}

	public clone(): Matrix {
		return new Matrix(this.matrixArray);
	}
}
