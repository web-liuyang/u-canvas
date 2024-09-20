import { Cloneable, Equatable } from "../../types";

interface FillOptions {
	color: string;
}

export class Fill implements Cloneable<FillOptions>, Equatable<Fill> {
	public color: string;

	constructor(options?: Partial<FillOptions>) {
		this.color = options?.color ?? "transparent";
	}

	public copyWith(options: Partial<FillOptions>): Fill {
		return new Fill({
			color: options.color ?? this.color,
		});
	}

	public equals(other: Fill): boolean {
		return this.color === other.color;
	}
}
