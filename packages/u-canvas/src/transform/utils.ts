import { Point } from "../types";
import type { MatrixArray } from "./matrix";
import { Matrix } from "./matrix";

/**
 * Return true, if Point in the Polygon.
 */
export function isPointInPolygon(point: Point, polygon: Point[]) {
	const [px, py] = point;
	let isInside = false;

	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i][0];
		const yi = polygon[i][1];
		const xj = polygon[j][0];
		const yj = polygon[j][1];
		const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
		if (intersect) isInside = !isInside;
	}

	return isInside;
}

/**
 * Matrix multiplication
 * a * b
 *
 * A * B : 左乘的效果是先用 A 对 B 进行变换，然后再将 A 应用于变换后的结果。
 *
 * B * A : 右乘的效果是先用 B 对 A 进行变换，然后再将 B 应用于变换后的结果。
 *
 *
 * 例如 A * B
 *
 * 先把 A 的 a b c d 应用给 B 的 tx 与 ty，然后 A 与 B 的 a b c d 相乘，最后与 A 的 tx 与 ty 相加
 *
 * ace ace
 * bdf bdf
 * 001 001
 */
export function multiply(mA: Matrix, mB: Matrix): Matrix {
	const a = mA.a * mB.a + mA.c * mB.b + mA.e * 0;
	const b = mA.b * mB.a + mA.d * mB.b + mA.f * 0;
	const c = mA.a * mB.c + mA.c * mB.d + mA.e * 0;
	const d = mA.b * mB.c + mA.d * mB.d + mA.f * 0;
	const tx = mA.a * mB.e + mA.c * mB.f + mA.e * 1;
	const ty = mA.b * mB.e + mA.d * mB.f + mA.f * 1;

	const matrixArray: MatrixArray = [a, b, c, d, tx, ty];

	return new Matrix(matrixArray);
}
