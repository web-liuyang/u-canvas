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

export enum FEventType {
	"tap" = "tap",
	"touchdown" = "touchdown",
	"touchup" = "touchup",
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

export class FTouchEvent implements TouchInfo {
	/** 事件类型 */
	public readonly type: FEventType;
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

	constructor(type: FEventType, touchInfo: TouchInfo) {
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

export class FTapEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.tap, touchInfo);
	}
}

export class FTouchdownEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.touchdown, touchInfo);
	}
}

export class FTouchupEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.touchup, touchInfo);
	}
}

export class FTouchstartEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.touchstart, touchInfo);
	}
}

export class FTouchmoveEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.touchmove, touchInfo);
	}
}

export class FTouchendEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.touchcancel, touchInfo);
	}
}

export class FTouchcancelEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.touchcancel, touchInfo);
	}
}

export class FZoominEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.zoomin, touchInfo);
	}
}

export class FZoomoutEvent extends FTouchEvent {
	constructor(touchInfo: TouchInfo) {
		super(FEventType.zoomout, touchInfo);
	}
}

export const resolveTouchInfo = (e: UniTouchEvent | MouseEvent | TouchEvent): TouchInfo => {
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

export const resolveMultiTouchInfo = (e: UniTouchEvent | TouchEvent): TouchInfo[] => {
	const touchInfos: TouchInfo[] = [];

	for (const touch of e.touches) {
		touchInfos.push({
			x: touch.clientX,
			y: touch.clientY,
			pageX: touch.pageX,
			pageY: touch.pageY,
			screenX: touch.screenX,
			screenY: touch.screenY,
		});
	}

	return touchInfos;
};
