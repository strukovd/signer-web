<template>
	<section class="index-page" :class="{ offline: !appStore.online }">
		<ClientOnly>
			<swiper-container  style="width:100%;" ref="swiper" direction="horizontal" effect="slide" :autoplay="{ delay: 5000, disableOnInteraction: false }" :loop="true" :speed="500">
				<swiper-slide v-for="(slide,i) of slides" :key="i" style="color:white;">
					<section class="slide-section">
						<h2 v-if="slide?.title" class="slide-title">{{ slide.title }}</h2>
						<img class="slide-image" :src="slide.image"/>
					</section>
				</swiper-slide>
			</swiper-container>
			<aside class="aside-buttons">
				<BaseButton v-if="!appStore.online" class="aside-button" @click="reconnect">🔴 Переподключится</BaseButton>
				<BaseButton class="aside-button" @click="closeSession" prependIcon="mdi-logout">Завершить сессию</BaseButton>
			</aside>
		</ClientOnly>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';
const appStore = useAppStore();

definePageMeta({
	auth: true,
});

function closeSession() {
	const user = useUserStore();
	user.loguot();
}

function reconnect() {
	useNuxtApp().$socket?.connect();
}

const swiper = ref(null);
const slides = [
	{ image: `/banners/1.jpg` },
	{ image: `/banners/2.jpg` },
	{ image: `/banners/3.jpg` },
] as Record<string, any>[];
</script>

<style lang="scss">
.index-page {
	position: relative;

	&.offline {
		filter: grayscale(.8);
	}

	swiper-slide {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(var(--vh, 1vh) * 100);

		.slide-section {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 1em;
			width: 100%;
			height: 100%;

			.slide-title {
				position:absolute;
				bottom:0;
				text-align: center;
				font-size: 2.4em;
				font-weight: 700;
			}
			.slide-image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}

	.aside-buttons {
		z-index: 9999;
		position: absolute;
		bottom: 1em;
		right: 1em;
		// transform: translateX(-50%);
		display:flex;
		flex-direction:row;
		gap:.4em;

		.aside-button {
			backdrop-filter: blur(10px);
			box-shadow:0 0 4px rgba(0,0,0,0.1);
			background-color: #ffffff44 !important;
			color: #333 !important;
			font-weight:700 !important;
		}

		.button-text {
			font-weight:700;
		}
	}
}
</style>
