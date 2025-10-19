<template>
	<section class="rating-page">
		<main class="rating-wrapper">
			<h1>Оцените качество работы оператора</h1>
			<div class="grades">
				<div style="background:#d30327;" class="grade">1</div>
				<div style="background:#ea0b0c;" class="grade">2</div>
				<div style="background:#f13609;" class="grade">3</div>
				<div style="background:#f97604;" class="grade">4</div>
				<div style="background:#f6b304;" class="grade">5</div>
				<div style="background:#f7dd04;" class="grade">6</div>
				<div style="background:#cedd12;" class="grade">7</div>
				<div style="background:#8ad523;" class="grade">8</div>
				<div style="background:#44bc37;" class="grade">9</div>
				<div style="background:#14ab4a;" class="grade">10</div>
			</div>
		</main>
		<footer class="footer">
			<BaseButton @click="navigateTo('/finish')" style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';

</script>

<style lang="scss">
.rating-page {
	$padding-size: .6em;
	height: 100vh;
	display: flex;
	gap:$padding-size;
	flex-direction: column;
	// margin:auto auto;

	.rating-wrapper {
		position: relative;
		padding:$padding-size $padding-size 0 $padding-size;
		flex:auto 1 0;

		h1 {
			text-align: center;
			font-size: 2.4em;
			font-weight: 700;
		}
		.grades {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: end;
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
