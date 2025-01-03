export interface Pointer {
	/** 触摸点的标识符。这个值在这根手指所引发的所有事件中保持一致，直到手指抬起。 */
	id: number;
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
	/** 指针目标 */
	target: UniElement | EventTarget;
}

export class TouchEvent {
	/** 事件创建的时间（以毫秒为单位）。 */
	public readonly timestamp: number;
	/** 指针数组 */
	public readonly pointer: Pointer;
	/** 原生事件 */
	public readonly nativeEvent: UniTouchEvent | MouseEvent;

	constructor(pointer: TouchEvent["pointer"], nativeEvent: TouchEvent["nativeEvent"]) {
		this.timestamp = Date.now();
		this.pointer = pointer;
		this.nativeEvent = nativeEvent;
	}
}

export class ClickEvent extends TouchEvent {
	constructor(pointer: TouchEvent["pointer"], nativeEvent: TouchEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export class PointerdownEvent extends TouchEvent {
	constructor(pointer: TouchEvent["pointer"], nativeEvent: TouchEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export class PointermoveEvent extends TouchEvent {
	constructor(pointer: TouchEvent["pointer"], nativeEvent: TouchEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export class PointerupEvent extends TouchEvent {
	constructor(pointer: TouchEvent["pointer"], nativeEvent: TouchEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export class PointercancelEvent extends TouchEvent {
	constructor(pointer: TouchEvent["pointer"], nativeEvent: TouchEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export interface EventTypeMap {
	onclick: ClickEvent;
	onpointerdown: PointerdownEvent;
	onpointermove: PointermoveEvent;
	onpointerup: PointerupEvent;
	onpointercancel: PointercancelEvent;
}
