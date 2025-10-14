<template>
	<ClientOnly>
		<VuePdfEmbed
			:source="path"
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
		path: String
	});

</script>

<style>

</style>
