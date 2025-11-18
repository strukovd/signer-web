<template>
	<section class="finish-page">
		<main class="finish-wrapper">
			<p>Спасибо за отзыв!</p>
		</main>
		<footer class="footer">
			<BaseButton @click="appStore.nextPage()" style="flex:auto 1 0;" append-icon="mdi-arrow-right">В НАЧАЛО</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';

const appStore = useAppStore();
</script>

<style lang="scss">
.finish-page {
	$padding-size: .6em;
	height: 100vh;
	display: flex;
	gap:$padding-size;
	flex-direction: column;
	// margin:auto auto;

	.finish-wrapper {
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
