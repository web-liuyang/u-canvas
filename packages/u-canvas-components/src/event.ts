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
	"zoomin" = "zoomin",
	"zoomout" = "zoomout",
}

export interface Delta {
	deltaX: number;

	deltaY: number;
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

	constructor(type: ICEventType, touchInfo: TouchInfo) {
		this.type = type;

		this.x = touchInfo.x;
		this.y = touchInfo.y;
		this.pageX = touchInfo.pageX;
		this.pageY = touchInfo.pageY;
		this.screenX = touchInfo.screenX;
		this.screenY = touchInfo.screenY;
	}

	public get touchInfo(): TouchInfo {
		return this;
	}
}

export class ICTapEvent extends ICTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(ICEventType.tap, touchInfo);
	}
}

export class ICTouchstartEvent extends ICTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(ICEventType.touchstart, touchInfo);
	}
}

export class ICTouchmoveEvent extends ICTouchEvent implements Delta {
	public readonly deltaX: number;

	public readonly deltaY: number;

	constructor(touchInfo: TouchInfo & Delta) {
		super(ICEventType.touchmove, touchInfo);
		this.deltaX = touchInfo.deltaX;
		this.deltaY = touchInfo.deltaY;
	}
}

export class ICTouchendEvent extends ICTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(ICEventType.touchcancel, touchInfo);
	}
}

export class ICTouchcancelEvent extends ICTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(ICEventType.touchcancel, touchInfo);
	}
}

export class ICZoominEvent extends ICTouchEvent {
	constructor(touchInfo: TouchInfo) {
		console.log(touchInfo);
		super(ICEventType.zoomin, touchInfo);
	}
}

export class ICZoomoutEvent extends ICTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(ICEventType.zoomout, touchInfo);
	}
}

export const resolveTouchInfo = (e: UniTouchEvent | MouseEvent | TouchEvent): TouchInfo => {
	// console.log(e);
	// #ifdef WEB
	if (e instanceof MouseEvent) {
		return {
			x: e.x,
			y: e.y,
			pageX: e.pageX,
			pageY: e.pageY,
			screenX: e.screenX,
			screenY: e.screenY,
		};
	}
	// #endif

	return {
		x: e.touches[0].clientX,
		y: e.touches[0].clientY,
		pageX: e.touches[0].pageX,
		pageY: e.touches[0].pageY,
		screenX: e.touches[0].screenX,
		screenY: e.touches[0].screenY,
	};
};
