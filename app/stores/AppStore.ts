import { acceptHMRUpdate, defineStore } from 'pinia';

type Issue = {
	address: string;
	date: string;
	id: number;
	issueKey: string;
	issueStatus: string;
	summary: string;
};

export const useAppStore = defineStore('app', {
	state: () => ({
		issues: [] as Issue[],
	}),
	actions: {}
});

// if(import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
// }
