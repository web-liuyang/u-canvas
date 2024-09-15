export const bb = 1;

export const aa = 1;

// interface TouchInfo {
// 	/** 相对于页面可显示区域左边的距离 */
// 	x: number;
// 	/** 相对于页面可显示区域顶部的距离 */
// 	y: number;
// 	/** 相对于屏幕左边的距离，包括滚动距离 */
// 	pageX: number;
// 	/** 相对于屏幕顶部的距离，包括滚动距离 */
// 	pageY: number;
// 	/** 相对于屏幕左边的距离，不包括滚动距离 */
// 	screenX: number;
// 	/** 相对于屏幕顶部的距离，不包括滚动距离 */
// 	screenY: number;
// }

// export enum ICEventType {
// 	"tap" = "tap",
// 	"touchstart" = "touchstart",
// 	"touchmove" = "touchmove",
// 	"touchend" = "touchend",
// 	"touchcancel" = "touchcancel",
// }

export class ICTouchEvent {
	/** 事件类型 */
	public readonly type: ICEventType;
	/** 相对于页面可显示区域左边的距离 */
	public readonly x: number;
	/** 相对于页面可显示区域顶部的距离 */
	public readonly y: number;
	/** 相对于屏幕左边的距离，包括滚动距离 */
	public readonly pageX: number;
	/** 相对于屏幕顶部的距离，包括滚动距离 */
	public readonly pageY: number;
	/** 相对于屏幕左边的距离，不包括滚动距离 */
	public readonly screenX: number;
	/** 相对于屏幕顶部的距离，不包括滚动距离 */
	public readonly screenY: number;

	constructor(type: ICEventType, uniTouch: UniTouch) {
		this.type = type;

		this.x = uniTouch.clientX;
		this.y = uniTouch.clientY;
		this.pageX = uniTouch.pageX;
		this.pageY = uniTouch.pageY;
		this.screenX = uniTouch.screenX;
		this.screenY = uniTouch.screenY;
	}
}
