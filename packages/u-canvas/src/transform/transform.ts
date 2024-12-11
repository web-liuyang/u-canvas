import { Container } from "../container";
import { Parent } from "../types";
import { Matrix } from "./matrix";
import { multiply } from "./utils";

export abstract class Transform implements Parent {
	parent?: Container | undefined;

	public matrix: Matrix = new Matrix();

	get worldMatrix() {
		const parentWorldMatrix = this.parent?.worldMatrix ?? new Matrix();
		const worldMatrix = multiply(parentWorldMatrix, this.matrix);
		return worldMatrix;
	}
}
