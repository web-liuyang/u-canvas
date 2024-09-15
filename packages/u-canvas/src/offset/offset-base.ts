export abstract class OffsetBase {
	public readonly dx: number;

	public readonly dy: number;

	constructor(dx: number, dy: number) {
		this.dx = dx;
		this.dy = dy;
	}
}
