<template>
	<section class="signature-page">
		<main class="signature-pad-wrapper">
			<template v-if="error">
				<section style="text-align:center; margin:4em 0; font-size:1.8em;">
					<BaseIcon name="mdi-alert" fill="goldenrod" size="5em" />
					<h2>{{ error }}</h2>
				</section>
			</template>
			<template v-else-if="[`SHOW_DOCUMENT`, `SHOW_SIGNED_DOCUMENT`].includes(stage)">
				<div v-if="isPdfLoading" class="pdf-loader">
					<BaseIcon name="mdi-loading" size="3em" />
					<span>Загрузка документа...</span>
				</div>
				<PDF
					v-if="documentContent"
					:source="documentContent"
					@loaded="onPdfLoaded"
					@rendered="onPdfRendered"
					@loading-failed="onPdfLoadingFailed"
					@rendering-failed="onPdfLoadingFailed"
				/>
			</template>
			<template v-else-if="stage === `TO_SIGN`">
				<div class="signature-hint">
					<BaseIcon name="mdi-pencil"/>
					<span> Нарисуйте подпись на экране</span>
				</div>
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
import BaseIcon from '~/components/common/BaseIcon.vue';

type DocumentResult = { fileName: string; fileContent: string };

const appStore = useAppStore();
const stage = ref(`SHOW_DOCUMENT`) as Ref<`SHOW_DOCUMENT` | `TO_SIGN` | `SHOW_SIGNED_DOCUMENT`>;
const error = ref(null) as Ref<string | null>;
let documentContent = ref(null) as Ref<any>;
const isPdfLoading = ref(false);

function next() {
	switch(stage.value) {
		case `SHOW_DOCUMENT`:
			clearDocumentContent();
			stage.value = `TO_SIGN`;
			break;
		case `TO_SIGN`:
			clearDocumentContent();
			toSignDocument();
			stage.value = `SHOW_SIGNED_DOCUMENT`;
			break;
		case `SHOW_SIGNED_DOCUMENT`:
			appStore.nextPage();
			return;
	}
}

async function base64ToFile(base64String: string, fileName: string, mimeType: string) {
  const dataUrl = base64String.startsWith('data:') ? base64String : `data:${mimeType};base64,${base64String}`;
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: mimeType });
}

async function fetchDocument() {
	const documentId = appStore.pageParams().documentId;
	if(!documentId) return;

	isPdfLoading.value = true;
	$api(`v1/office-app/documents`, {
		method: 'GET',
		params: { documentId },
		headers: { 'auth-token': localStorage.getItem('token') } as Record<string, string>,
	})
		.then((data: any) => {
			const blob = new Blob([Uint8Array.from(atob(data.fileContent), c => c.charCodeAt(0))], {
				type: 'application/pdf',
			});
			setDocumentContent(URL.createObjectURL(blob));

			// documentContent.value = `data:application/pdf;base64,${data.fileContent}`;
		})
		.catch((err: any) => {
			appStore.error = err?.data?.message ?? err?.response?.message ?? err;
			error.value = err?.data?.message ?? err?.response?.message ?? err;
			isPdfLoading.value = false;
		});
}

async function toSignDocument() {
	const { documentId, closeSubTask } = appStore.pageParams();
	if(!documentId) return;

	isPdfLoading.value = true;
	const signature = signaturePad.value.saveSignature();
	const signatureFile = await base64ToFile(signature, 'signature.png', 'image/png');

	const formData = new FormData();
	formData.append('files',  signatureFile);
	formData.append('documentId', String(documentId));
	formData.append('closeSubTask', String(closeSubTask));

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
			setDocumentContent(URL.createObjectURL(blob));
		})
		.catch((err: FetchError) => {
			appStore.error = err?.data?.message ?? err?.response?.message ?? err;
			error.value = err?.data?.message ?? err?.response?.message ?? err;
			isPdfLoading.value = false;
		});
}

const options = ref({
  penColor: '#000000',
  backgroundColor: 'rgba(0, 0, 0, 0)',
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

function setDocumentContent(url: string) {
	if (typeof documentContent.value === 'string' && documentContent.value.startsWith('blob:')) {
		URL.revokeObjectURL(documentContent.value);
	}
	documentContent.value = url;
}

function clearDocumentContent() {
	if (typeof documentContent.value === 'string' && documentContent.value.startsWith('blob:')) {
		URL.revokeObjectURL(documentContent.value);
	}
	documentContent.value = null;
}

function resetSignatureState() {
	if (typeof documentContent.value === 'string' && documentContent.value.startsWith('blob:')) {
		URL.revokeObjectURL(documentContent.value);
	}
	documentContent.value = null;
	error.value = null;
	isPdfLoading.value = false;
	stage.value = 'SHOW_DOCUMENT';
	if (signaturePad.value?.clearCanvas) {
		signaturePad.value.clearCanvas();
	}
}

watch(
	() => [
		appStore.pageOffset,
		appStore.pages.length,
		appStore.pages[appStore.pageOffset]?.type,
		appStore.pageParams().documentId,
	],
	() => {
		resetSignatureState();
		fetchDocument();
	},
	{ immediate: true }
);

function onPdfLoaded() {
	// документ загружен, ждём рендеринга
}

function onPdfRendered() {
	isPdfLoading.value = false;
}

function onPdfLoadingFailed(err: any) {
	isPdfLoading.value = false;
	if (!error.value) {
		appStore.error = err?.message ?? err;
		error.value = err?.message ?? err;
	}
}
</script>

<style lang="scss">
.signature-page {
	.signature-pad-wrapper {
		position: relative;
		flex:auto 1 0;
	}

	.signature-hint {
		position: absolute;
		width:100%;
		text-align: center;
		z-index: 3;
		padding: .4em 0;
		font-size: 1.2em;
		font-weight: 700;
		color: #183d6d;
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(6px);
		border-radius: 6px;
	}

	.pdf-loader {
		position: absolute;
		inset: 0;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6em;
		font-size: 1.3em;
		font-weight: 600;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(6px);
		color: #183d6d;
	}

	.pdf-loader :deep(svg) {
		animation: pdf-spin 1.2s linear infinite;
	}

	.footer {
		flex:auto 0 0;
		.base-button {
			.button-text {
				font-family: "Carlito", Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
				line-height:2em;
				font-weight:700;
			}
		}
	}
}

@keyframes pdf-spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
</style>
