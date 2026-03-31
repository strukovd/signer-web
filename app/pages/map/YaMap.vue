<template>
	<div class="map-root">
		<div class="map-search" :class="{ 'map-search_expanded': isSearchExpanded }">
			<button
				v-if="!isSearchExpanded"
				type="button"
				class="map-search__toggle"
				aria-label="Открыть поиск"
				@click="openSearch"
			>
				<span class="map-search__icon" aria-hidden="true">⌕</span>
			</button>

			<div v-else class="map-search__field">
				<input
					ref="searchInput"
					v-model.trim="searchQuery"
					type="text"
					class="map-search__input"
					placeholder="Поиск"
					autocomplete="off"
					@input="onSearchInput"
					@focus="onSearchFocus"
					@keydown="onSearchKeydown"
					@blur="onSearchBlur"
				/>
				<button
					type="button"
					class="map-search__icon-button"
					aria-label="Свернуть поиск"
					@click="collapseSearch"
				>
					<span class="map-search__icon" aria-hidden="true">⌕</span>
				</button>
			</div>

			<div
				v-if="showSearchDropdown"
				class="map-search__results"
			>
				<div v-if="isSearching" class="map-search__status">
					Ищем...
				</div>

				<div
					v-else-if="searchError"
					class="map-search__status map-search__status_error"
				>
					{{ searchError }}
				</div>

				<div
					v-else-if="searchResults.length === 0 && normalizedSearchQuery.length >= 3"
					class="map-search__status"
				>
					Ничего не найдено
				</div>

				<button
					v-for="result in searchResults"
					:key="result.id"
					type="button"
					class="map-search__result"
					@click.prevent="selectSearchResult(result)"
					@touchend="selectSearchResult(result)"
				>
					<span class="map-search__result-title">{{ result.title }}</span>
					<span v-if="result.description" class="map-search__result-description">
						{{ result.description }}
					</span>
				</button>
			</div>
		</div>

		<div id="map"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw, PropType, toRaw } from 'vue';
import type { YMap } from "@yandex/ymaps3-types";
import { Listener } from './Listener';
import { Marker } from './Marker';
import type { YMapMarker } from '@yandex/ymaps3-types';

type Coordinates = [number, number];
type SearchResult = {
	id: string;
	title: string;
	description: string;
	coordinates: Coordinates;
};

declare global {
	interface Window {
		ymaps3: typeof ymaps3;
		gpMapStore: {
			map?: YMap;
			marker?: Marker | null;
			popup?: YMapMarker | null;
			popupClose?: () => void;
		};
	}
}


export default defineComponent({
	name: 'MainPage',
	emits: ['ready', 'update:modelValue', 'select'],
	props: {
		modelValue: {
			type: Array as PropType<Coordinates | null>,
			default: null,
		},
	},
	data() {
		return {
			map: null as YMap | null,
			marker: null as Marker | null,
			searchQuery: '',
			searchResults: [] as SearchResult[],
			isSearching: false,
			searchError: '',
			isSearchFocused: false,
			isSearchExpanded: false,
			searchDebounceTimer: null as ReturnType<typeof setTimeout> | null,
			searchRequestId: 0,
		};
	},
	computed: {
		normalizedSearchQuery(): string {
			return this.searchQuery.trim();
		},
		showSearchDropdown(): boolean {
			return this.isSearchFocused && (
				this.isSearching ||
				Boolean(this.searchError) ||
				this.searchResults.length > 0 ||
				this.normalizedSearchQuery.length >= 3
			);
		},
	},
	watch: {
		modelValue(value: Coordinates | null) {
			if(!this.map) return;
			if(!value || value.length !== 2) {
				this.clearMarker();
				return;
			}
			this.placeMarker(value, false);
		},
	},
	methods: {
		placeMarker(coords: Coordinates, emit = true) {
			const map = this.map ? toRaw(this.map) : null;
			if(!map) return;
			this.clearMarker();
			this.marker = markRaw(new Marker(map, [...coords] as Coordinates));
			if(emit) {
				this.$emit('update:modelValue', coords);
				this.$emit('select', coords);
			}
		},

		clearMarker() {
			const marker = this.marker ? toRaw(this.marker) : null;
			if(!marker) return;
			marker.destroy();
			this.marker = null;
		},

		openSearch() {
			this.isSearchExpanded = true;
			this.isSearchFocused = true;
			this.$nextTick(() => {
				const input = this.$refs.searchInput as HTMLInputElement | undefined;
				input?.focus();
			});
		},

		collapseSearch() {
			this.isSearchFocused = false;
			if(this.searchDebounceTimer) {
				clearTimeout(this.searchDebounceTimer);
				this.searchDebounceTimer = null;
			}
			this.isSearching = false;
			this.isSearchExpanded = false;
		},

		onSearchInput() {
			this.searchError = '';
			this.isSearchExpanded = true;
			this.isSearchFocused = true;

			if(this.searchDebounceTimer) {
				clearTimeout(this.searchDebounceTimer);
				this.searchDebounceTimer = null;
			}

			if(this.normalizedSearchQuery.length < 3) {
				this.searchResults = [];
				this.isSearching = false;
				return;
			}

			this.searchDebounceTimer = setTimeout(() => {
				this.runSearch(this.normalizedSearchQuery);
			}, 1000);
		},

		onSearchFocus() {
			this.isSearchExpanded = true;
			this.isSearchFocused = true;
		},

		onSearchBlur() {
			window.setTimeout(() => {
				this.isSearchFocused = false;
				if(!this.normalizedSearchQuery) {
					this.isSearchExpanded = false;
				}
			}, 100);
		},

		onSearchKeydown(event: KeyboardEvent) {
			if(event.key === 'Enter') {
				event.preventDefault();
				this.isSearchFocused = true;
				if(this.searchDebounceTimer) {
					clearTimeout(this.searchDebounceTimer);
					this.searchDebounceTimer = null;
				}

				if(this.normalizedSearchQuery.length >= 3) {
					this.runSearch(this.normalizedSearchQuery);
				}
			}

			if(event.key === 'Escape') {
				this.collapseSearch();
			}
		},

		normalizeSearchResults(items: any[]): SearchResult[] {
			return items
				.map((item, index) => {
					const coordinates = item?.geometry?.coordinates;
					if(!Array.isArray(coordinates) || coordinates.length !== 2) return null;

					const lng = Number(coordinates[0]);
					const lat = Number(coordinates[1]);

					return {
						id: [
							String(item?.properties?.uri ?? ''),
							String(item?.properties?.name ?? ''),
							String(item?.properties?.description ?? ''),
							String(lng),
							String(lat),
							String(index),
						].join('::'),
						title: String(item?.properties?.name ?? 'Без названия'),
						description: String(item?.properties?.description ?? ''),
						coordinates: [lng, lat] as Coordinates,
					};
				})
				.filter((item): item is SearchResult => Boolean(item));
		},

		async runSearch(query: string) {
			if(query.length < 3) return;

			const currentRequestId = ++this.searchRequestId;
			this.isSearching = true;
			this.searchError = '';
			this.isSearchFocused = true;

			try {
				const search = (window.ymaps3 as typeof ymaps3 & {
					search?: (params: { text: string }) => Promise<any[]>;
				}).search;

				if(typeof search !== 'function') {
					throw new Error('Поиск в ymaps3 недоступен');
				}

				const results = await search({ text: query });
				if(currentRequestId !== this.searchRequestId) return;

				this.searchResults = this.normalizeSearchResults(Array.isArray(results) ? results : []);
			}
			catch (error) {
				if(currentRequestId !== this.searchRequestId) return;
				console.error(error);
				this.searchResults = [];
				this.searchError = 'Не удалось выполнить поиск';
			}
			finally {
				if(currentRequestId === this.searchRequestId) {
					this.isSearching = false;
				}
			}
		},

		selectSearchResult(result: SearchResult) {
			const map = this.map ? toRaw(this.map) : null;
			if(!map) return;
			const coordinates = [...result.coordinates] as Coordinates;

			this.isSearchFocused = false;
			this.isSearchExpanded = false;

			map.update({
				location: {
					center: coordinates,
					zoom: 16,
					duration: 400,
				},
			});

			this.placeMarker(coordinates, true);
		},

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
					center: this.modelValue ?? [74.601572, 42.885146],
					zoom: 16
				},
				behaviors: ['drag', 'scrollZoom', 'pinchZoom', 'dblClickZoom']
			});

			// Добавляем слой для отображения схематической карты
			map.addChild(new YMapDefaultSchemeLayer({}));
			map.addChild(new YMapDefaultFeaturesLayer({}));

			const listener = new Listener(map, (coordinates) => {
				this.placeMarker(coordinates as Coordinates, true);
			});
			listener.init();

			const rawMap = markRaw(map);
			window.gpMapStore.map = this.map = rawMap;
			if(!window.gpMapStore.popupClose) {
				window.gpMapStore.popupClose = () => {
					const { map: currentMap, popup } = window.gpMapStore;
					if(currentMap && popup) {
						currentMap.removeChild(popup);
						window.gpMapStore.popup = null;
					}
				};
			}

			if(this.modelValue && this.modelValue.length === 2) {
				this.placeMarker(this.modelValue as Coordinates, false);
			}

			this.$emit('ready', map);
		},
	},
	async mounted() {
		if(!window.gpMapStore) window.gpMapStore = {};
		await this.initMap();
	},
	beforeUnmount() {
		if(this.searchDebounceTimer) {
			clearTimeout(this.searchDebounceTimer);
		}
		this.clearMarker();
	},
});
</script>

<style lang="scss">
.map-root {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

#map {
	position:absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.map-search {
	position: absolute;
	top: 12px;
	right: 12px;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	width: fit-content;

	&_expanded {
		width: min(360px, calc(100vw - 24px));
	}

	&__field {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border: 1px solid #d9dde7;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
		backdrop-filter: blur(8px);
	}

	&__toggle,
	&__icon-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 1px solid #d9dde7;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
		cursor: pointer;
		backdrop-filter: blur(8px);
	}

	&__icon-button {
		flex: 0 0 auto;
		width: 24px;
		height: 24px;
		border: 0;
		border-radius: 8px;
		background: transparent;
		box-shadow: none;
	}

	&__icon {
		color: #667085;
		font-size: 16px;
		line-height: 1;
	}

	&__input {
		flex: 1;
		width: 100%;
		padding: 0;
		border: 0;
		outline: none;
		background: transparent;
		font-size: 14px;
		line-height: 20px;
		color: #101828;
	}

	&__results {
		margin-top: 8px;
		width: 100%;
		overflow: hidden;
		border: 1px solid #d9dde7;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.98);
		box-shadow: 0 16px 40px rgba(15, 23, 42, 0.16);
	}

	&__status {
		padding: 12px 14px;
		font-size: 13px;
		line-height: 18px;
		color: #667085;
	}

	&__status_error {
		color: #b42318;
	}

	&__result {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 12px 14px;
		border: 0;
		border-top: 1px solid #eaecf0;
		background: transparent;
		text-align: left;
		cursor: pointer;

		&:first-child {
			border-top: 0;
		}

		&:hover {
			background: #f8fafc;
		}
	}

	&__result-title {
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
		color: #101828;
	}

	&__result-description {
		margin-top: 2px;
		font-size: 12px;
		line-height: 18px;
		color: #667085;
	}
}

#map {
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
