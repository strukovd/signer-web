<template>
	<section class="signature-page">
		<main class="signature-pad-wrapper">
			<NuxtSignaturePad
				ref="signature"
				width="100%"
				height="100%"
				:max-width="options.maxWidth"
				:min-width="options.minWidth"
				:options="{
					penColor: options.penColor,
					backgroundColor: options.backgroundColor,
				}"
			/>
			<aside style="position:absolute; bottom:.5em; right:1.1em; display:flex; gap:.5em">
				<BaseButton @click="handleUndo" append-icon="mdi-undo" variant="secondary"></BaseButton>
				<BaseButton @click="handleClear" append-icon="mdi-delete" variant="secondary"></BaseButton>
			</aside>
		</main>
		<footer class="footer">
			<BaseButton style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';


const options = ref({
  penColor: '#183d6d',
  backgroundColor: 'rgb(255, 255, 255)',
  maxWidth: 4,
  minWidth: 1,
});
const signature = ref();

const handleSave = (format?: string) => {
  return alert(signature.value.saveSignature(format))
};
const handleClear = () => {
  return signature.value.clearCanvas();
};
const handleUndo = () => {
  return signature.value.undo();
};

const handleFromDataURL = (url: string) => {
  return signature.value.fromDataURL(url);
};

const handleAddWaterMark = () => {
    return signature.value.addWaterMark({
    text: "Watermark",          // watermark text, > default ''
    font: "20px Arial",         // mark font, > default '20px sans-serif'
    style: 'all',               // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill
    fillStyle: "red",           // fillcolor, > default '#333'
    strokeStyle: "blue",      // strokecolor, > default '#333'
    x: 100,                     // fill positionX, > default 20
    y: 200,                     // fill positionY, > default 20
    sx: 100,                    // stroke positionX, > default 40
    sy: 200                     // stroke positionY, > default 40
  });
}
</script>

<style lang="scss">
.signature-page {
	$padding-size: .6em;
	height: 100vh;
	display: flex;
	gap:$padding-size;
	flex-direction: column;
	// margin:auto auto;

	.signature-pad-wrapper {
		position: relative;
		padding:$padding-size $padding-size 0 $padding-size;
		flex:auto 1 0;
		// overflow:auto;
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
