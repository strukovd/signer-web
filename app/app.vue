<template>
		<NuxtLayout>
			<NuxtPage :pageKey="pageInstanceKey"/>
		</NuxtLayout>
	</template>

<script lang="ts" setup>
import type { Page } from './types';

const fallbackPage: Page = { type: 'DEFAULT' };
const appStore = useAppStore();

const currentPage = computed<Page>(() => {
	return appStore.pages[ appStore.pageOffset ] ?? fallbackPage;
});
const pageInstanceKey = computed(() => `${currentPage.value.type}-${appStore.pageOffset}`);

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
	const updateViewportHeight = () => {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
	};

	onMounted(() => {
		updateViewportHeight();
		window.addEventListener('resize', updateViewportHeight);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('resize', updateViewportHeight);
	});

	watch(
		() => [appStore.pageOffset, currentPage.value.type],
		([offset, type]) => {
			console.log(`offset ${offset}`);
			console.log(`новый тип: ${type}`);

			const targetPath = pageRoutes[type] ?? pageRoutes.DEFAULT;
			// if(route.path === targetPath) return;
			console.log(`текущю страница: ${route.path}`);
			console.log(`куда нужно перейти: ${targetPath}\n\n`);

			// router.go(targetPath);
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
	padding: 0;
	background-color: #e0f2fe;
	color: #183d6d;
	font-family: "Carlito", Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
	height: calc(var(--vh, 1vh) * 100);
	padding-top: env(safe-area-inset-top);
}

html, body {
	overscroll-behavior-y: none;
}
</style>
