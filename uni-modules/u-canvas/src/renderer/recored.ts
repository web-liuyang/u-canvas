export enum RecordType {
	moveTo,
	lineTo,
	rect,
	arc,
	arcTo,
	closePath,
}

export interface Record {
	type: RecordType;
}

export interface MoveToRecord {
	type: RecordType.moveTo;
	x: number;
	y: number;
}

export interface LineToRecord {
	type: RecordType.lineTo;
	x: number;
	y: number;
}

export interface RectRecord {
	type: RecordType.rect;
	x: number;
	y: number;
	w: number;
	h: number;
	radii: number;
}

export interface ArcRecord {
	type: RecordType.arc;
	cx: number;
	cy: number;
	radius: number;
	startAngle: number;
	endAngle: number;
	counterclockwise: boolean;
}

export interface ArcToRecord {
	type: RecordType.arcTo;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	radius: number;
}

export interface ClosePathRecord {
	type: RecordType.closePath;
}

export type AllRecord = MoveToRecord | LineToRecord | RectRecord | ArcRecord | ArcToRecord | ClosePathRecord;

export class RecordFactory {
	public static createMoveToRecord(x: number, y: number): MoveToRecord {
		return {
			type: RecordType.moveTo,
			x,
			y,
		};
	}

	public static createLineToRecord(x: number, y: number): LineToRecord {
		return {
			type: RecordType.lineTo,
			x,
			y,
		};
	}

	public static createRectRecord(x: number, y: number, w: number, h: number, radii: number = 0): RectRecord {
		return {
			type: RecordType.rect,
			x,
			y,
			w,
			h,
			radii,
		};
	}

	public static createArcRecord(
		cx: number,
		cy: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise: boolean
	): ArcRecord {
		return {
			type: RecordType.arc,
			cx,
			cy,
			radius,
			startAngle,
			endAngle,
			counterclockwise,
		};
	}

	public static createArcToRecord(x1: number, y1: number, x2: number, y2: number, radius: number): ArcToRecord {
		return {
			type: RecordType.arcTo,
			x1,
			y1,
			x2,
			y2,
			radius,
		};
	}

	public static createClosePathRecord(): ClosePathRecord {
		return {
			type: RecordType.closePath,
		};
	}
}
