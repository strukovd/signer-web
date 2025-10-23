<template>
	<section class="main-page">
		<main class="PDF-wrapper">
			<PDF path="file.pdf"/>
		</main>
		<footer class="footer">
			<BaseButton @click="navigateTo('/signature')" style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';


</script>

<style lang="scss">
.main-page {
	.PDF-wrapper {
		// height:90vh;
		// overflow:auto;
		// padding:1em;
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
