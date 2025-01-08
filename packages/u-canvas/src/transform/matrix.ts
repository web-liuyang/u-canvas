import { Point } from "../offset";
import { multiply, rotate, scale, setTranslate, translate } from "./utils";

/**
 * Matrix Array Type
 * a, b, c, d, e, f
 */
export type MatrixArray = [number, number, number, number, number, number];

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
	public multiply(other: Matrix): Matrix {
		return this.replace(multiply(other, this));
	}

	/**
	 * Matrix multiplication vector
	 */
	public apply(point: Point): Point {
		const x1 = this.a * point.x + this.c * point.y + this.e;
		const y1 = this.b * point.x + this.d * point.y + this.f;

		return new Point(x1, y1);
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
}
