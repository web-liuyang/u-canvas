import type { Point } from "../types";
import { multiply, rotate, scale, setTranslate, translate } from "./utils";

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
	// public multiply(other: Matrix, direction: MultiplicativeDirection = MultiplicativeDirection.Right): Matrix {
	public multiply(other: Matrix): Matrix {
		return this.replace(multiply(other, this));

		// switch (direction) {
		// 	case MultiplicativeDirection.Left:
		// 		return multiply(this, other);
		// 	case MultiplicativeDirection.Right:
		// 		return multiply(other, this);
		// }
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
		return this.replace(translate(this, tx, ty));
	}

	public rotate(xt: number, yt: number): Matrix {
		return this.replace(rotate(this, xt, yt));
	}

	public setTranslate(tx: number, ty: number): Matrix {
		return this.replace(setTranslate(this, tx, ty));
	}

	/**
	 * Scale
	 *
	 * At locate [point] scale, if the [point] exist.
	 */
	public scale(x: number, y: number, point?: Point): Matrix {
		return this.replace(scale(this, x, y, point));
	}

	public clone(): Matrix {
		return new Matrix(this.matrixArray);
	}

	public replace(matrix: Matrix): Matrix {
		this.a = matrix.a;
		this.b = matrix.b;
		this.c = matrix.c;
		this.d = matrix.d;
		this.e = matrix.e;
		this.f = matrix.f;

		return this;
	}

	public toDOMMatrix(): DOMMatrix {
		return DOMMatrix.fromMatrix(this);
	}
}
