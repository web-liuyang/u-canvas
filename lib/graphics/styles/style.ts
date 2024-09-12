import { Cloneable, Equatable } from "../../types";
import { Fill } from "./fill";
import { Stroke } from "./stroke";

export interface StyleOptions {
	stroke: Stroke;
	fill: Fill;
}

export class Style implements Cloneable<StyleOptions>, Equatable<Style> {
	public readonly stroke: Stroke;

	public readonly fill: Fill;

	constructor(options?: Partial<StyleOptions>) {
		this.stroke = options?.stroke ?? new Stroke();
		this.fill = options?.fill ?? new Fill();
	}

	public copyWith(options: Partial<StyleOptions>): Style {
		return new Style({
			stroke: options.stroke ?? this.stroke,
			fill: options.fill ?? this.fill,
		});
	}

	public equals(other: Style): boolean {
		return this.stroke.equals(other.stroke) && this.fill.equals(other.fill);
	}
}
