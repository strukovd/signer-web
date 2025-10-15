// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	css: [
		'@mdi/font/css/materialdesignicons.min.css',
	],

	modules: ['nuxt-signature-pad'],
})
