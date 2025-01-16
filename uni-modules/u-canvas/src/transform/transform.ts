import type { Graphic } from "../graphics";
import type { Parent } from "../types";
import { Matrix } from "./matrix";
import { multiply } from "./utils";

export abstract class Transform implements Parent<Graphic> {
	parent?: Graphic;

	public matrix: Matrix = new Matrix();

	get worldMatrix() {
		const parentWorldMatrix = this.parent?.worldMatrix ?? new Matrix();
		const worldMatrix = multiply(parentWorldMatrix, this.matrix);
		return worldMatrix;
	}
}
