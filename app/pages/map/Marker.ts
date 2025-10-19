import type { LngLat, YMap, YMapMarker } from "@yandex/ymaps3-types";
import type { MapEvent } from "@yandex/ymaps3-types/imperative/YMapFeature/types";

type MarkerDetails = {
	titleMap?: Record<string, string>;
	data?: Record<string, any>;
	popup?: unknown;
	color?: string;
};

export class Marker {
	public self = null as YMapMarker | null;
	public popup = undefined as YMapMarker | undefined;

	constructor(
		public map: YMap,
		public coordinate: number[],
		public details?: MarkerDetails
	) {
		if(!map) throw new Error('Map is not initialized');
		if(!coordinate) throw new Error('Coordinates are not initialized');

		this.map = map;
		this.coordinate = coordinate;

		this.draw();
		// this.ymapPolygone?.update({
		// 	onFastClick: (e) => {
		// 		const prev = useMapStore().selected as Selectable | null;
		// 		if(prev) {
		// 			prev.toggleSelected();
		// 		}
		// 		this.toggleSelected();
		// 		useMapStore().selected = this;
		// 	},
		// 	onDoubleClick: (e) => {
		// 		this.setEditMode(!this.editMode);
		// 	},
		// });
	}

	public draw(): this {
		const markerElement = document.createElement("div");
		const markerColor = this.details?.color ?? "#0078D7";
		markerElement.innerHTML = `
		<div style="position: absolute;transform: translate(-50%, -100%);">
			<div style="width: 24px;height: 24px;background: ${markerColor};border-radius: 50% 50% 50% 0;transform: rotate(-45deg);box-shadow: 0 0 4px rgba(0,0,0,0.3);position: relative;">
				<div style="position: absolute;top: 50%;left: 50%;width: 10px;height: 10px;background: white;border-radius: 50%;transform: translate(-50%, -50%) rotate(45deg);"></div>
			</div>
		</div>`;
		markerElement.classList.add("map-marker");

		const marker = new ymaps3.YMapMarker({
			coordinates: this.coordinate as LngLat,
			// onClick: this.onClick,
			onFastClick: this.onClick,
		},
		markerElement
		);

		this.map.addChild(marker);
		this.self = marker;
		return this;
	}

	onClick: (event: MouseEvent, mapEvent: MapEvent) => void = (event, mapEvent) => {
		if(window.gpMapStore.popup) {
			const { popup } = window.gpMapStore;
			let isSamePopup = false;
			if(popup === this.popup) isSamePopup = true;

			window.gpMapStore.popupClose();
			if(isSamePopup) return;
		}

		const popup = this.details?.popup;
		let popupEl: HTMLElement | null = null;

		if(!popup) return;

		if(typeof popup === 'function') {
			popupEl = popup();
		}
		else {
			if(typeof popup === 'string') {
				const div = document.createElement(`div`);
				div.innerHTML = popup;
				popupEl = div;
			}
			else if(typeof popup === 'object' && popup instanceof HTMLElement) {
				popupEl = popup;
			}
		}

		if(!popupEl) return;

		const popupMarker = new ymaps3.YMapMarker({ coordinates: this.coordinate as LngLat }, popupEl);
		this.map.addChild(popupMarker);
		window.gpMapStore.popup = this.popup = popupMarker;
		window.gpMapStore.popup = popupMarker;
	};

	closePopup() {
		if(!window.gpMapStore.popup) return;
		window.gpMapStore.popupClose();
		window.gpMapStore.popup = this.popup = undefined;
	}

	destroy() {
		if(!this.self) return;
		this.map.removeChild(this.self);
		this.self = null;
	}
}

