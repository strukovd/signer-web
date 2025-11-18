import { acceptHMRUpdate, defineStore } from 'pinia';
import type { Page } from '~/types';



export const useAppStore = defineStore('app', {
	state: () => ({
		pages: [] as Page[],
		pageOffset: 0,
	}),
	actions: {
		nextPage() {
			this.pageOffset++;
			if(this.pageOffset >= this.pages.length) {
				this.pages = [];
				this.pageOffset = 0;
			}
		},
		prevPage() {
			this.pageOffset--;
			if(this.pageOffset < 0) {
				this.pageOffset = 0;
			}
		}
	}
});

// if(import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
// }
