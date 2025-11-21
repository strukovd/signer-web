import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => ({
		token: import.meta.browser ? localStorage.getItem('token') : null as string | null,
		userData: null as any,
	}),
	actions: {
		setData(data: any) {
			if(!data || !data.accessToken) {
				console.error('Token не получен!');
			}
			this.token = data.accessToken;
			// this.userData = data.userData;
			localStorage.setItem('token', data.accessToken);
			// localStorage.setItem('user', JSON.stringify(data.userData));
		},

		loadFromStorage() {
			const token = localStorage.getItem('token');
			// const userStr = localStorage.getItem('user');
			if (token) this.token = token;
			// if (userStr) {
			// 	try {
			// 		const u = JSON.parse(userStr);
			// 		this.userData = u;
			// 	}
			// 	catch {}
			// }
		},

		loguot() {
			this.token = null;
			this.userData = null;
			localStorage.removeItem('token');
			navigateTo('/login');
		}
	}
});

// if(import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
// }
