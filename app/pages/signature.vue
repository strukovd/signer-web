<template>
	<section class="signature-page">
		<main class="signature-pad-wrapper">
			<template v-if="[`SHOW_DOCUMENT`, `SHOW_SIGNED_DOCUMENT`].includes(stage)">
				<PDF v-if="documentContent" :source="documentContent"/>
			</template>
			<template v-else-if="stage === `TO_SIGN`">
				<NuxtSignaturePad
					ref="signaturePad"
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
			</template>
		</main>
		<footer class="footer">
			<BaseButton @click="next" style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();
import BaseButton from '~/components/common/BaseButton.vue';

type DocumentResult = { fileName: string; fileContent: string };

onMounted(() => {
	fetchDocument();
});

const appStore = useAppStore();
const stage = ref(`SHOW_DOCUMENT`) as Ref<`SHOW_DOCUMENT` | `TO_SIGN` | `SHOW_SIGNED_DOCUMENT`>;
let documentContent = ref(null) as Ref<any>;

function next() {
	switch(stage.value) {
		case `SHOW_DOCUMENT`:
			stage.value = `TO_SIGN`;
			break;
		case `TO_SIGN`:
			toSignDocument();
			stage.value = `SHOW_SIGNED_DOCUMENT`;
			break;
		case `SHOW_SIGNED_DOCUMENT`:
			break;
	}
	// appStore.nextPage();
}

async function base64ToFile(base64String: string, fileName: string, mimeType: string) {
  const dataUrl = base64String.startsWith('data:') ? base64String : `data:${mimeType};base64,${base64String}`;
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: mimeType });
}

async function fetchDocument() {
	const documentId = appStore.pages[ appStore.pageOffset ]?.documentId;
	if(!documentId) return;

	$api(`v1/office-app/documents`, {
		method: 'GET',
		params: { documentId },
		headers: { 'auth-token': localStorage.getItem('token') } as Record<string, string>,
	})
		.then((data: any) => {
			const blob = new Blob([Uint8Array.from(atob(data.fileContent), c => c.charCodeAt(0))], {
				type: 'application/pdf',
			});
			documentContent.value = URL.createObjectURL(blob);

			// documentContent.value = `data:application/pdf;base64,${data.fileContent}`;
		})
		// .catch((err: FetchError) => {
		// 	error.value = err.message;
		// });
}

async function toSignDocument() {
	const documentId = appStore.pages[ appStore.pageOffset ]?.documentId;
	if(!documentId) return;

	const signature = signaturePad.value.saveSignature();
	const signatureFile = await base64ToFile(signature, 'signature.png', 'image/png');

	const formData = new FormData();
	formData.append('files',  signatureFile);
	formData.append('documentId', String(documentId));


	$api(`v1/office-app/documents/signature`, {
		method: 'POST',

		headers: {
			// 'Content-Type': 'multipart/form-data',
			'auth-token': localStorage.getItem('token'),
		} as Record<string, string>,
		body: formData,
	})
		.then((data: any) => {
			const blob = new Blob([Uint8Array.from(atob(data.fileContent), c => c.charCodeAt(0))], {
				type: 'application/pdf',
			});
			documentContent.value = URL.createObjectURL(blob);
		})
		// .catch((err: FetchError) => {
		// 	error.value = err.message;
		// });
}

const options = ref({
  penColor: '#183d6d',
  backgroundColor: 'rgb(255, 255, 255)',
  maxWidth: 4,
  minWidth: 1,
});
const signaturePad = ref();

const handleSave = (format?: string) => {
  return alert(signaturePad.value.saveSignature(format))
};
const handleClear = () => {
  return signaturePad.value.clearCanvas();
};
const handleUndo = () => {
  return signaturePad.value.undo();
};

const handleFromDataURL = (url: string) => {
  return signaturePad.value.fromDataURL(url);
};

const handleAddWaterMark = () => {
    return signaturePad.value.addWaterMark({
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
	.signature-pad-wrapper {
		position: relative;
		flex:auto 1 0;
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
