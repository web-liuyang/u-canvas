export interface TouchInfo {
	/** 相对于页面可显示区域左边的距离 */
	x: number;
	/** 相对于页面可显示区域顶部的距离 */
	y: number;
	/** 相对于屏幕左边的距离，包括滚动距离 */
	pageX: number;
	/** 相对于屏幕顶部的距离，包括滚动距离 */
	pageY: number;
	/** 相对于屏幕左边的距离，不包括滚动距离 */
	screenX: number;
	/** 相对于屏幕顶部的距离，不包括滚动距离 */
	screenY: number;
}

export enum ICEventType {
	"tap" = "tap",
	"touchstart" = "touchstart",
	"touchmove" = "touchmove",
	"touchend" = "touchend",
	"touchcancel" = "touchcancel",
}

export class ICTouchEvent implements TouchInfo {
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

export class ICTapEvent extends ICTouchEvent {
	constructor(uniTouch: UniTouch) {
		super(ICEventType.tap, uniTouch);
	}
}

export class ICTouchstartEvent extends ICTouchEvent {
	constructor(uniTouch: UniTouch) {
		super(ICEventType.touchstart, uniTouch);
	}
}

export class ICTouchmoveEvent extends ICTouchEvent {
	constructor(uniTouch: UniTouch) {
		super(ICEventType.touchmove, uniTouch);
	}
}

export class ICTouchendEvent extends ICTouchEvent {
	constructor(uniTouch: UniTouch) {
		super(ICEventType.touchcancel, uniTouch);
	}
}

export class ICTouchcancelEvent extends ICTouchEvent {
	constructor(uniTouch: UniTouch) {
		super(ICEventType.touchcancel, uniTouch);
	}
}
