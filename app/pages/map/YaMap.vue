<template>
	<div id="map" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { YMap } from "@yandex/ymaps3-types";
import { Listener } from './Listener';
import type { Marker } from './Marker.js';

declare global {
	interface Window {
		ymaps3: typeof ymaps3;
		gpMapStore: {
			map: YMap,
			marker: Marker,
		};
	}
}


export default defineComponent({
	name: 'MainPage',
	emits: ['ready'],
	components: {},
	computed: {
		// ...mapStores(useAppStore),
	},
	created() {},
	data() {
		return {
			map: null as YMap | null
		};
	},
	methods: {
		async waitForYmaps3(): Promise<typeof ymaps3> {
			return new Promise((resolve, reject) => {
				const timeout = 10000; // максимум 10 секунд
				const interval = 50;
				let waited = 0;

				const check = () => {
					if (typeof window !== 'undefined' && 'ymaps3' in window) {
						resolve(window.ymaps3);
					} else if (waited >= timeout) {
						reject(new Error('ymaps3 не загрузился за 10 секунд'));
					} else {
						waited += interval;
						setTimeout(check, interval);
					}
				};

				check();
			});
		},

		async injectYandexMap() {
			if( window.ymaps3 ) {
				console.warn(`Карта уже загружена!`);
				return;
			}

			const yandexMapScript = document.createElement('SCRIPT');
			const url = new URL(`https://api-maps.yandex.ru/v3/`);
			url.searchParams.set('lang', 'ru_RU');
			url.searchParams.set('apikey', '62c88456-1fdb-474c-8ed3-a45218e508ca');

			const scriptAttributes = {
				async: '',
				defer: '',
				referrerpolicy: 'strict-origin-when-cross-origin',
				type: 'text/javascript',
				src: url.toString(),
			} as Record<string, any>;

			for (const key in scriptAttributes) {
				if (scriptAttributes[key] === false) continue;
				yandexMapScript.setAttribute(key, scriptAttributes[key]);
			}

			document.head.appendChild(yandexMapScript);

			await this.waitForYmaps3();
			await ymaps3.ready;
		},

		async initMap() {
			await this.injectYandexMap();
			const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;

			// Иницилиазируем карту
			const el = document.querySelector('#map');
			if(!el) {
				console.error('Element #map not found');
				return;
			}

			const map = new YMap(el, {
				location: {
					center: [74.601572, 42.885146],
					zoom: 10
				},
				behaviors: ['drag', 'scrollZoom']
			});

			// Добавляем слой для отображения схематической карты
			map.addChild(new YMapDefaultSchemeLayer({}));
			map.addChild(new YMapDefaultFeaturesLayer({}));

			new Listener(map).init();

			window.gpMapStore.map = this.map = map;
			this.$emit('ready', map);
		},
	},
	async mounted() {
		if(!window.gpMapStore) window.gpMapStore = {};
		await this.initMap();
	}
});
</script>

<style lang="scss">
#map {
	position:relative;

	.map-header {
		.mode {
			background-color:#ffffffcc;
			display:flex;
			flex-direction:row;
			flex-wrap:nowrap;
			margin:0;
			position:absolute;
			top:0;
			right:0;
			left:0;
			z-index:99999;
		}
	}
}

.polygon-vertex-marker {

    position: absolute;
    width: 8px;
    height: 8px;
    cursor: pointer;
    border: 1.5px solid #196dff;
    border-radius: 8px;
    background-color: #fff;
    transform: translate(-50%, -50%);

	&:hover {
		background-color: #196dff;
	}
	&:active {
		background-color: #629bfc;
		border-color: #196dff;
	}
}

.polygon-coord-label {
	background: white;
	border: 1px solid #333;
	padding: 2px 4px;
	border-radius: 3px;
	font-size: 12px;
	white-space: nowrap;
	pointer-events: none;
	transform: translate(-50%, -140%);
}
</style>
