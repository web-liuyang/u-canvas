// import { Circle, Composition, ImagePixel, Image, Pie, Polygon, Polyline, Rectangle, Ring, Text } from "../shapes";
// import { Point } from "../../types";
// import { Graphic } from "../shapes/graphic";
// import { isPointOnLineSegment } from "../utils";

// export function hitTestCircle(point: Point, circle: Circle): Circle | undefined {
// 	const [x, y] = point;
// 	const { cx, cy, radius } = circle;

// 	if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(radius, 2)) return circle;
// 	return;
// }

// export function hitTestComposition(point: Point, composition: Composition): Graphic | undefined {
// 	if (composition.children.length === 0) return;

// 	for (let i = composition.children.length - 1; i >= 0; i--) {
// 		const child = composition.children[i];
// 		const hitTarget = child.hitTest(point);
// 		if (hitTarget !== undefined) return hitTarget;
// 	}

// 	return;
// }

// export function hitTestImagePixel(point: Point, imagePixel: ImagePixel): ImagePixel | undefined {
// 	const [x, y] = point;
// 	const {
// 		imageData: { width, height },
// 	} = imagePixel;

// 	if (x >= imagePixel.x && x <= imagePixel.x + width && y >= imagePixel.y && y <= imagePixel.y + height)
// 		return imagePixel;

// 	return;
// }

// export function hitTestImage(point: Point, image: Image): Image | undefined {
// 	const [x, y] = point;
// 	const { sx, sy, sw, sh } = image;
// 	// 没有传宽高就需要自己计算了

// 	// if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) return this;

// 	return;
// }

// export function hitTestPie(point: Point, pie: Pie): Pie | undefined {
// 	const [x, y] = point;
// 	const { cx, cy, radius, startAngle, endAngle } = pie;
// 	const [dx, dy] = [x - cx, y - cy];
// 	const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

// 	if (distance <= radius) {
// 		let angle = Math.atan2(dy, dx);
// 		// Adjust the angle to be between 0 and 2π
// 		if (angle < 0) angle += 2 * Math.PI;
// 		if (angle >= startAngle && angle <= endAngle) return pie;
// 	}

// 	return;
// }

// export function hitTestPolygon(point: Point, polygon: Polygon): Polygon | undefined {
// 	const points = polygon.points.slice();
// 	if (polygon.close) points.push(points[0]);

// 	const [x, y] = point;
// 	let isInside = false;
// 	// 多边形边界检测
// 	for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
// 		const [vix, viy] = points[i];
// 		const [vjx, vjy] = points[j];

// 		if (viy > y !== vjy > y && x < ((vjx - vix) * (y - viy)) / (vjy - viy) + vix) {
// 			isInside = !isInside;
// 		}
// 	}

// 	if (isInside) polygon;

// 	return;
// }

// export function hitTestPolyline(point: Point, polyline: Polyline): Polyline | undefined {
// 	const points = polyline.points;
// 	let currentPoint = points[0];
// 	for (let i = 1; i < points.length; i++) {
// 		const isOnSegment = isPointOnLineSegment(point, new Line);
// 		if (isOnSegment) return polyline;
// 		currentPoint = points[i];
// 	}

// 	return;
// }

// export function hitTestRectangle(point: Point, rectangle: Rectangle): Rectangle | undefined {
// 	const [x, y] = point;
// 	const { x: leftTopX, y: leftTopY, w, h, radii } = rectangle;
// 	const rightBottomX = leftTopX + w;
// 	const rightBottomY = leftTopY + h;

// 	if (x >= leftTopX && x <= rightBottomX && y >= leftTopY && y <= rightBottomY) return rectangle;

// 	if (x >= leftTopX && x <= leftTopX + w && y >= leftTopY && y <= leftTopY + h) {
// 		return rectangle; // 点在矩形内部
// 		// 检查点是否在圆角矩形的圆角区域内
// 	} else if (
// 		(x >= leftTopX && x <= leftTopX + radii && y >= leftTopY && y <= leftTopY + radii) ||
// 		(x >= leftTopX + w - radii && x <= leftTopX + w && y >= leftTopY && y <= leftTopY + radii) ||
// 		(x >= leftTopX && x <= leftTopX + radii && y >= leftTopY + h - radii && y <= leftTopY + h) ||
// 		(x >= leftTopX + w - radii && x <= leftTopX + w && y >= leftTopY + h - radii && y <= leftTopY + h)
// 	) {
// 		const res =
// 			Math.sqrt(Math.pow(x - (leftTopX + radii), 2) + Math.pow(y - (leftTopY + radii), 2)) <= radii ||
// 			Math.sqrt(Math.pow(x - (leftTopX + w - radii), 2) + Math.pow(y - (leftTopY + radii), 2)) <= radii ||
// 			Math.sqrt(Math.pow(x - (leftTopX + radii), 2) + Math.pow(y - (leftTopY + h - radii), 2)) <= radii ||
// 			Math.sqrt(Math.pow(x - (leftTopX + w - radii), 2) + Math.pow(y - (leftTopY + h - radii), 2)) <= radii;

// 		if (res) return rectangle;
// 	}

// 	return;
// }

// export function hitTestRing(point: Point, ring: Ring): Ring | undefined {
// 	const [x, y] = point;
// 	const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = ring;

// 	const [dx, dy] = [x - cx, y - cy];
// 	const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

// 	if (distance >= innerRadius && distance <= outerRadius) {
// 		let angle = Math.atan2(dy, dx);
// 		// Adjust the angle to be between 0 and 2π
// 		if (angle < 0) angle += 2 * Math.PI;
// 		if (angle >= startAngle && angle <= endAngle) return ring;
// 	}

// 	return undefined;
// }

// export function hitTestText(point: Point, text: Text): Text | undefined {
// 	// const [x, y] = point;
// 	const { x, y, style } = text;

// 	// 这里要计算文本的宽高后才能算命中

// 	return undefined;
// }
