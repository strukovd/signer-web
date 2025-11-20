<template>
	<section class="default-layout">
		<slot />
	</section>
</template>

<script lang="ts" setup>

// onMounted(() => {
// 	document.documentElement.requestFullscreen();
// });
</script>

<style lang="scss">
.default-layout {
	& > [class$="page"] {
		display: flex;
		flex-direction: column;
		min-height: calc(var(--vh, 1vh) * 100);

		>:first-child {
			flex:auto 1 1;
			overflow:auto;
		}
		>:nth-child(2) {
			padding: 1em;
			// padding-bottom: calc(1em + env(safe-area-inset-bottom));
			display:flex;
			margin-top: auto;
		}
	}
}
</style>
