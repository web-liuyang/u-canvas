import { AllRecord, RecordFactory } from "./recored";

export class Path {
	public records: AllRecord[] = [];

	public moveTo(x: number, y: number): void {
		this.records.push(RecordFactory.createMoveToRecord(x, y));
	}

	public lineTo(x: number, y: number): void {
		this.records.push(RecordFactory.createLineToRecord(x, y));
	}

	public rect(x: number, y: number, w: number, h: number, radii: number): void {
		this.records.push(RecordFactory.createRectRecord(x, y, w, h, radii));
	}

	public arc(
		cx: number,
		cy: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise: boolean
	): void {
		this.records.push(RecordFactory.createArcRecord(cx, cy, radius, startAngle, endAngle, counterclockwise));
	}

	public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
		this.records.push(RecordFactory.createArcToRecord(x1, y1, x2, y2, radius));
	}

	public closePath(): void {
		this.records.push(RecordFactory.createClosePathRecord());
	}
}
