// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	css: [
		'@mdi/font/css/materialdesignicons.min.css',
	],

	modules: ['nuxt-signature-pad', '@pinia/nuxt', 'nuxt-swiper', '@vite-pwa/nuxt'],

	nitro: { // Для генерации статических файлов
		prerender: {
			routes: ['/']
		},
		preset: 'static',
	},
	app: {
		baseURL: process.env.BASE_URL ?? '/',
		// buildAssetsDir: 'assets/',
		head: {
			link: [
				{ rel: 'manifest', href: 'manifest.json' },
				{ rel: 'icon', href: 'favicon.svg' }
			],
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
				{ name: 'theme-color', content: 'transparent' },
				{ name: 'mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
			]
		}
	},

	runtimeConfig: {
		public: {
			// Префикс для API
			apiURL: process.env.NUXT_PUBLIC_API_BASE ?? 'https://api.gazprom.kg/api',
			wsURL: process.env.NUXT_PUBLIC_WS_BASE ?? 'wss://api.gazprom.kg', // ?deviceId=1234567',

			// Токен
			apiToken: process.env.NUXT_PUBLIC_API_TOKEN ?? `5ROtG52b5lq5ib6q1web91z5asfAs15h21d12sf1a12b5HG`,
		},
	},

	pwa: {
		manifest: {
			name: "OfficeApp",
			short_name: "OfficeApp",
			start_url: "/",
			display: "standalone",
			theme_color: "#333333",
			icons: [
				{
					src: "icon-192x192.webp",
					sizes: "192x192",
					type: "image/webp"
				}
			]
		},
		registerType: 'autoUpdate',
		workbox: {
			cleanupOutdatedCaches: true, // 🔥 удаляет старые кэши
			clientsClaim: true,          // 🔥 новый SW сразу управляет страницами
			skipWaiting: true,           // 🔥 НЕ ждёт перезапуска
			navigateFallback: null,      // 🔥 ОТКЛЮЧАЕМ попытки SW подменять навигацию на "/"
		}
	}
})
