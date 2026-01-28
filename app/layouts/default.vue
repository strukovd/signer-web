<template>
	<section class="default-layout">
		<header>
			<section class="signals" v-if="Array.isArray(appStore.signals) && appStore.signals.length">
				<div v-for="(signal, index) of appStore.signals" :key="index" class="signal-message glass">{{ /^[^А-Яа-яЁё0-9A-Za-z_ ]/.test(String(signal)) ? signal : `🟢 ${signal}` }}</div>
			</section>
		</header>
		<slot />
		<footer style="user-select:none;">
			<section v-if="!appStore.online" class="is-online">
				<div class="glass" @dblclick="onOfflineDblClick">🔴 Отключен</div>
			</section>
			<!-- <section class="error-message" v-if="appStore.error">
				<div class="glass">{{ appStore.error }}</div>
			</section> -->
		</footer>
	</section>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
const appStore = useAppStore();
const { $socket } = useNuxtApp();
let wakeLock: WakeLockSentinel | null = null;

async function requestWakeLock() {
	try {
		if (!("wakeLock" in navigator)) return;

		// Если уже есть — не дёргай лишний раз
		if (wakeLock) return;

		wakeLock = await navigator.wakeLock.request("screen");

		// Если lock отвалится сам — подчистим ссылку
		wakeLock.addEventListener("release", () => {
		wakeLock = null;
		});
	} catch (err: any) {
		// NotAllowedError часто бывает если вкладка не активна / нет жеста / политика энергосбережения
		appStore.signals.push(`🔴 WakeLock error: ${err?.name} ${err?.message}`);
		console.error("WakeLock error:", err?.name, err?.message);
		wakeLock = null;
	}
}

async function releaseWakeLock() {
	try {
		await wakeLock?.release();
	} catch (_) {}
	wakeLock = null;
}

function onVisibilityChange() {
	if (document.visibilityState === "visible") {
		requestWakeLock();
	} else {
		// можно не release, но лучше подчистить: некоторые браузеры и так “сами”
		releaseWakeLock();
	}
}

onMounted(() => {
	document.addEventListener("visibilitychange", onVisibilityChange);
	requestWakeLock();
});

onBeforeUnmount(() => {
	document.removeEventListener("visibilitychange", onVisibilityChange);
	releaseWakeLock();
});

function onOfflineDblClick() {
	if (appStore.online) return;
	$socket?.connect();
}
</script>

<style lang="scss">
.default-layout {
	> header {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 99;

		.signals {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 2em;

			.signal-message {}
		}
	}

	& > [class$="page"] {
		display: flex;
		flex-direction: column;
		height: calc(var(--vh, 1vh) * 100);

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

	> footer {
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 99;

		.is-online, .error-message {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 2em;
		}
	}

	.glass {
		font-size: 1.4em;
		backdrop-filter: blur(10px);
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
		background-color: rgba(255, 255, 255, 0.2666666667) !important;
		color: #333;
		font-weight: 700 !important;
		padding:.45em .6em .6em .6em;
		border-radius: 4px;
	}
}
</style>
