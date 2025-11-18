<template>
	<NuxtLayout>
		{{ currentPage.type }}
		<NuxtPage :pageKey="currentPage.type"/>
	</NuxtLayout>
</template>

<script lang="ts" setup>
import type { Page } from './types';

const fallbackPage: Page = { type: 'DEFAULT' };

const currentPage = computed<Page>(() => {
	const appStore = useAppStore();
	return appStore.pages[ appStore.pageOffset ] ?? fallbackPage;
});

const router = useRouter();
const route = useRoute();

const pageRoutes: Record<Page['type'], string> = {
	FINISH: '/finish',
	PDF: '/pdf',
	RATING: '/rating',
	SIGNATURE: '/signature',
	COORDINATE: '/map',
	DEFAULT: '/',
};

if(import.meta.client) {
	watch(
		() => currentPage.value.type,
		(type) => {
			const targetPath = pageRoutes[type] ?? pageRoutes.DEFAULT;
			if(route.path === targetPath) return;

			router.replace(targetPath);
		},
		{ immediate: true }
	);
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap');

body {
	margin: 0;
	background-color: #e0f2fe;
    color: #183d6d;
    font-family: "Carlito", Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
}
</style>
