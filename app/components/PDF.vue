<template>
	<ClientOnly>
		<VuePdfEmbed v-if="source"
			:source="source"
			annotation-layer
			text-layer
		/>
	</ClientOnly>
</template>

<script lang="ts" setup>
	import VuePdfEmbed from 'vue-pdf-embed';
	import 'vue-pdf-embed/dist/styles/annotationLayer.css';
	import 'vue-pdf-embed/dist/styles/textLayer.css';

	const props = defineProps({
		source: String
	});

</script>

<style>

</style>
