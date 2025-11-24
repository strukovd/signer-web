import type { DomEvent, DomEventHandler, YMap, YMapMarker } from "@yandex/ymaps3-types";
import { Marker } from "./Marker";


export class Listener {
	constructor(public map: YMap) {
		if(!map) throw new Error('Map is not initialized');
	}

	init() {
		const onClick = (object: Record<string, unknown>, event?: DomEvent) => {
			const { marker } = window.gpMapStore;
			if( marker ) marker.destroy();
			window.gpMapStore.marker = new Marker(this.map, event?.coordinates as number[]);
		};

		this.map.addChild(new ymaps3.YMapListener({
			onClick: onClick as DomEventHandler,
		}));
	}
}
