<template>
	<section class="map-page">
		<main class="map-wrapper">
			<YaMap/>
		</main>
		<footer class="footer">
			<BaseButton @click="navigateTo('/rating')" style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';
import YaMap from './YaMap.vue';
</script>

<style lang="scss">
.map-page {
	.map-wrapper {

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
