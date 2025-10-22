<template>
	<section class="default-layout">
		<slot />
	</section>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
.default-layout {
	& > [class$="page"] {
		display: flex;
		flex-direction: column;
		height: 100vh;

		>:first-child {
			flex:auto 1 1;
			overflow:auto;
		}
		>:nth-child(2) {
			padding:1em;
			display:flex;
			margin-top: auto;
		}
	}
}
</style>
