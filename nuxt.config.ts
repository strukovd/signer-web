// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	css: [
		'@mdi/font/css/materialdesignicons.min.css',
	],

	modules: ['nuxt-signature-pad', '@pinia/nuxt'],

	nitro: { // Для генерации статических файлов
		preset: 'github-pages',
	},
	app: {
		baseURL: process.env.BASE_URL ?? '/',
	},

	runtimeConfig: {
		public: {
			// Префикс для API
			apiURL: process.env.NUXT_PUBLIC_API_BASE ?? 'https://api.gazprom.kg/api',

			// Токен
			apiToken: process.env.NUXT_PUBLIC_API_TOKEN,
		},
	},
})
