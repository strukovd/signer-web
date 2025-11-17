// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	css: [
		'@mdi/font/css/materialdesignicons.min.css',
	],

	modules: ['nuxt-signature-pad', '@pinia/nuxt', 'nuxt-swiper'],

	nitro: { // Для генерации статических файлов
		preset: 'github-pages',
	},
	app: {
		baseURL: process.env.BASE_URL ?? '/',
		head: {
			link: [
				{ rel: 'manifest', href: '/manifest.json' },
				{ rel: 'icon', href: '/favicon.ico' }
			],
			meta: [
				{ name: 'theme-color', content: '#4A90E2' },
				{ name: 'mobile-web-app-capable', content: 'yes' }
			]
		}
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
