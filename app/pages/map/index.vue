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
	$padding-size: .6em;
	height: 100vh;
	display: flex;
	gap:$padding-size;
	flex-direction: column;
	// margin:auto auto;

	.map-wrapper {
		position: relative;
		padding:$padding-size $padding-size 0 $padding-size;
		flex:auto 1 0;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 1em;

		.grade {
			text-align: center;
			line-height: 2em;
			width:2em;
			color: #fff;
			font-size:3.4dvw;
			text-align: center;
			border-radius:30%;
			cursor: pointer;

			&:hover {
				opacity: .7;
			}
		}
	}

	.footer {
		padding:0 $padding-size $padding-size $padding-size;
		display: flex;

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
