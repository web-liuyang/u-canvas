import type { AllEntity } from "./entity";
import type { Style, ImageResource } from "../graphics";
import { EntityFactory } from "./entity";
import { Path } from "./path";
import { Matrix } from "../transform";
import { Point } from "../coords";

export interface CanvasOptions {
	matrix?: Matrix;
}

export class Canvas {
	/**
	 * 实例列表
	 */
	public entities: AllEntity[] = [];

	/**
	 * 初始化 matrix
	 */
	public readonly matrix: Matrix;

	/**
	 * 当前 matrix
	 */
	private _currentMatrix: Matrix;

	constructor(options: CanvasOptions) {
		this.matrix = options?.matrix?.clone() ?? new Matrix();
		this._currentMatrix = this.matrix.clone();
	}

	/**
	 * 添加画布
	 * @param canvas 画布
	 * @param style 样式
	 */
	public addCanvas(canvas: Canvas, style?: Style): void {
		this.entities.push(EntityFactory.createCanvasEntity(canvas, style));
	}

	/**
	 * 平移
	 * @param tx x 偏移量
	 * @param ty y 偏移量
	 */
	public translate(tx: number, ty: number): void {
		this._currentMatrix.translate(tx, ty);
		this.entities.push(EntityFactory.createMatrixEntity(this._currentMatrix.clone()));
	}

	/**
	 * 旋转
	 * @param xt x 弧度
	 * @param yt y 弧度
	 * @returns
	 */
	public rotate(xt: number, yt: number): void {
		this._currentMatrix.rotate(xt, yt);
		this.entities.push(EntityFactory.createMatrixEntity(this._currentMatrix.clone()));
	}

	/**
	 * 缩放
	 * @param x x 倍率
	 * @param y y 倍率
	 * @param point 根据此坐标点进行缩放
	 * @returns
	 */
	public scale(x: number, y: number): void {
		this._currentMatrix.scale(x, y);
		this.entities.push(EntityFactory.createMatrixEntity(this._currentMatrix.clone()));
	}

	/**
	 * 绘制线段
	 * @param x1 起始点 x 坐标
	 * @param y1 起始点 y 坐标
	 * @param x2 结束点 x 坐标
	 * @param y2 结束点 y 坐标
	 * @param style 样式
	 */
	public drawLine(x1: number, y1: number, x2: number, y2: number, style?: Style): void {
		const points: Point[] = [new Point(x1, y1), new Point(x2, y2)];

		this.entities.push(EntityFactory.createPolylineEntity(points, style));
	}

	/**
	 * 绘制多边形
	 * @param points 坐标点集合
	 * @param style 样式
	 */
	public drawPolygon(points: Point[], style?: Style): void {
		if (points.length < 3) {
			throw new Error("Polygon must have at least three points");
		}

		this.entities.push(EntityFactory.createPolygonEntity(points, style));
	}

	/**
	 * 绘制多线段
	 * @param points 坐标点集合
	 * @param style 样式
	 */
	public drawPolyline(points: Point[], style?: Style): void {
		if (points.length < 2) {
			throw new Error("Polyline must have at least two points");
		}

		points = points.slice();

		this.entities.push(EntityFactory.createPolylineEntity(points, style));
	}

	/**
	 * 绘制矩形
	 * @param x x 坐标
	 * @param y y 坐标
	 * @param w 宽度
	 * @param h 高度
	 * @param radii 圆角
	 * @param style 样式
	 */
	public drawRect(x: number, y: number, w: number, h: number, radii: number, style?: Style): void {
		radii = radii > 0 ? radii : 0;

		this.entities.push(EntityFactory.createRectEntity(x, y, w, h, radii, style));
	}

	/**
	 * 绘制圆形
	 * @param cx x 中心点
	 * @param cy y 中心点
	 * @param radius 半径
	 * @param style 样式
	 */
	public drawCircle(cx: number, cy: number, radius: number, style?: Style): void {
		this.entities.push(EntityFactory.createArcEntity(cx, cy, radius, 0, 2 * Math.PI, false, style));
	}

	/**
	 * 绘制文字
	 * @param text 文字
	 * @param x 基点 x 坐标
	 * @param y 基点 y 坐标
	 * @param style 样式
	 */
	public drawText(text: string, x: number, y: number, style?: Style): void {
		this.entities.push(EntityFactory.createTextEntity(text, x, y, style));
	}

	/**
	 * 绘制路径
	 * @param path 路径
	 * @param style 样式
	 */
	public drawPath(path: Path, style?: Style): void {
		this.entities.push(EntityFactory.createPathEntity(path, style));
	}

	/**
	 * 绘制弧形
	 * @param cx x 中心点
	 * @param cy y 中心点
	 * @param radius 半径
	 * @param startAngle 开始弧度
	 * @param endAngle 结束弧度
	 * @param counterclockwise 绘制方向, true 逆时针, false 顺时针.
	 * @param style 样式
	 */
	public drawArc(
		cx: number,
		cy: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise: boolean,
		style?: Style
	): void {
		this.entities.push(EntityFactory.createArcEntity(cx, cy, radius, startAngle, endAngle, counterclockwise, style));
	}

	/**
	 * 绘制图像
	 * @param image 图像资源
	 * @param x x 坐标
	 * @param y y 坐标
	 * @param w 宽度
	 * @param h 高度
	 * @param dx 裁剪图像数据的偏移量, 默认是整个图像数据的左上角（x 坐标）
	 * @param dy 裁剪图像数据的偏移量, 默认是整个图像数据的左上角（y 坐标）
	 * @param dw 裁剪图像数据的宽度, 默认是整个图像数据的宽度
	 * @param dh 裁剪图像数据的宽度, 默认是整个图像数据的高度
	 */
	public drawImage(
		image: ImageResource,
		x: number,
		y: number,
		w?: number,
		h?: number,
		dx?: number,
		dy?: number,
		dw?: number,
		dh?: number
	): void {
		this.entities.push(EntityFactory.createImageEntity(image, x, y, w, h, dx, dy, dw, dh));
	}

	/**
	 * 绘制图像像素
	 * @param imageData 图像数据
	 * @param x 基点 x 坐标
	 * @param y 基点 y 坐标
	 * @param dx 裁剪图像数据的偏移量, 默认是整个图像数据的左上角（x 坐标）
	 * @param dy 裁剪图像数据的偏移量, 默认是整个图像数据的左上角（y 坐标）
	 * @param dw 裁剪图像数据的宽度, 默认是整个图像数据的宽度
	 * @param dh 裁剪图像数据的宽度, 默认是整个图像数据的高度
	 */
	public drawImagePixel(
		imageData: ImageData,
		x: number,
		y: number,
		dx?: number,
		dy?: number,
		dw?: number,
		dh?: number
	): void {
		this.entities.push(EntityFactory.createImagePixelEntity(imageData, x, y, dx, dy, dw, dh));
	}
}
