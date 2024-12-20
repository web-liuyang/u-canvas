export type { CanvasOptions } from "./canvas";
export { Canvas } from "./canvas";

export type {
	Entity,
	MatrixEntity,
	CanvasEntity,
	RectEntity,
	PolygonEntity,
	PolylineEntity,
	ArcEntity,
	ImageEntity,
	ImagePixelEntity,
	TextEntity,
	PathEntity,
	AllEntity,
} from "./entity";
export { EntityFactory, EntityType } from "./entity";

export {
	applyStyle,
	renderCanvas,
	renderRect,
	renderText,
	renderImage,
	renderImagePixel,
	renderArc,
	renderPolyline,
	renderPolygon,
	renderPath,
} from "./entity-renderer";

export { Path } from "./path";

export type {
	RecordType,
	Record,
	MoveToRecord,
	LineToRecord,
	RectRecord,
	ArcRecord,
	ArcToRecord,
	ClosePathRecord,
	AllRecord,
} from "./recored";
export { RecordFactory } from "./recored";

export { Renderer } from "./renderer";
