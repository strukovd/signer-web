import type { DomEventHandler, YMap } from "@yandex/ymaps3-types";


export class Listener {
	constructor(
		public map: YMap,
		private onSelect?: (coordinates: number[]) => void,
	) {
		if(!map) throw new Error('Map is not initialized');
	}

	init() {
		this.map.addChild(new ymaps3.YMapListener({
			onClick: ((object, event) => {
				const coordinates = event?.coordinates as number[] | undefined;
				if(!coordinates) return;

				this.onSelect?.(coordinates);
			}) as DomEventHandler,
		}));
	}
}
