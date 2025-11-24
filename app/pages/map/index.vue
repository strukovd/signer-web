<template>
	<section class="map-page">
		<main class="map-wrapper">
			<YaMap/>
		</main>
		<footer class="footer">
			<BaseButton @click="saveCoordinates" style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';
import YaMap from './YaMap.vue';

const { $api } = useNuxtApp();
const appStore = useAppStore();


async function saveCoordinates(coordinates: string) {
	const issueKey = appStore.pageParams().issueKey;
	const operator = appStore.login;

	$api('v1/office-app/coordinates', {
		headers: { 'auth-token': localStorage.getItem('token') } as Record<string, string>,
		method: 'POST',
		body: {
			issueKey,
			coordinates,
			operator: operator,
		},
	})
		.then((data) => {
			appStore.nextPage();
			// if(data.accessToken) {
			// 	useUserStore().setData(data);
			// 	navigateTo('/');
			// }
		})
		// .catch((err: FetchError) => {
		// 	error.value = err.message;
		// });
}
</script>

<style lang="scss">
.map-page {
	.map-wrapper {
		position: relative;
	}

	.footer {
		.base-button {
			.button-text {
				font-family: "Carlito", Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
				line-height:2em;
				font-weight:700;
			}
		}
	}
}
</style>
