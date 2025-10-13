<template>
	<section class="main-page">
		<main class="PDF-wrapper">
			<PDF path="file.pdf"/>
		</main>
		<footer class="options" style="padding:1em; display:flex;">
			<BaseButton style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';


</script>

<style lang="scss">
.main-page {
	height: 100vh;
	// margin:auto auto;

	.PDF-wrapper {
		height:90vh;
		overflow:auto;
		padding:1em;
	}

	.options {
		.base-button {
			.button-text {
				font-weight:700;
			}
		}
	}
}
</style>
