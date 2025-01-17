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

export class BasePointerEvent {
	/** 事件创建的时间（以毫秒为单位）。 */
	public readonly timestamp: number;
	/** 指针数组 */
	public readonly pointer: Pointer;
	/** 原生事件 */
	public readonly nativeEvent: UniTouchEvent | MouseEvent | WheelEvent;

	constructor(pointer: BasePointerEvent["pointer"], nativeEvent: BasePointerEvent["nativeEvent"]) {
		this.timestamp = Date.now();
		this.pointer = pointer;
		this.nativeEvent = nativeEvent;
	}
}

export interface Delta {
	x: number;
	y: number;
}

export class PointerclickEvent extends BasePointerEvent {
	constructor(pointer: BasePointerEvent["pointer"], nativeEvent: BasePointerEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export class PointerdownEvent extends BasePointerEvent {
	constructor(pointer: BasePointerEvent["pointer"], nativeEvent: BasePointerEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export class PointermoveEvent extends BasePointerEvent {
	public pointer: Pointer & { delta: Delta };

	constructor(pointer: BasePointerEvent["pointer"] & { delta: Delta }, nativeEvent: BasePointerEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
		this.pointer = pointer;
	}
}

export class PointerupEvent extends BasePointerEvent {
	constructor(pointer: BasePointerEvent["pointer"], nativeEvent: BasePointerEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export class PointercancelEvent extends BasePointerEvent {
	constructor(pointer: BasePointerEvent["pointer"], nativeEvent: BasePointerEvent["nativeEvent"]) {
		super(pointer, nativeEvent);
	}
}

export class PointerwheelEvent extends BasePointerEvent {
	public readonly direction: "up" | "down" | "left" | "right";

	constructor(pointer: BasePointerEvent["pointer"], nativeEvent: WheelEvent) {
		super(pointer, nativeEvent);

		const deltaX = nativeEvent.deltaX;
		const deltaY = nativeEvent.deltaY;

		if (deltaY === 0) {
			this.direction = deltaX < 0 ? "left" : "right";
		} else {
			this.direction = deltaY < 0 ? "up" : "down";
		}
	}
}

export interface EventTypeMap {
	onpointerclick: PointerclickEvent;
	onpointerdown: PointerdownEvent;
	onpointermove: PointermoveEvent;
	onpointerup: PointerupEvent;
	onpointercancel: PointercancelEvent;
	onpointerwheel: PointerwheelEvent;
}
