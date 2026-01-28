<template>
	<ClientOnly>
		<div class="pdf-embed">
			<VuePdfEmbed v-if="source"
				:source="source"
				annotation-layer
				text-layer
				@internal-link-clicked="(payload) => emit('internal-link-clicked', payload)"
				@loaded="(payload) => emit('loaded', payload)"
				@loading-failed="(payload) => emit('loading-failed', payload)"
				@password-requested="(payload) => emit('password-requested', payload)"
				@progress="(payload) => emit('progress', payload)"
				@rendered="() => emit('rendered')"
				@rendering-failed="(payload) => emit('rendering-failed', payload)"
			>
				<template #after-page>
					<div class="pdf-page-gap" aria-hidden="true"></div>
				</template>
			</VuePdfEmbed>
		</div>
	</ClientOnly>
</template>

<script lang="ts" setup>
	import VuePdfEmbed from 'vue-pdf-embed';
	import 'vue-pdf-embed/dist/styles/annotationLayer.css';
	import 'vue-pdf-embed/dist/styles/textLayer.css';

	const props = defineProps({
		source: String
	});

	const emit = defineEmits([
		"internal-link-clicked",
		"loaded",
		"loading-failed",
		"password-requested",
		"progress",
		"rendered",
		"rendering-failed",
	]);
</script>

<style>
.pdf-page-gap {
	height: 24px;
}
</style>
