<template>
	<section class="index-page">
		<ClientOnly>
			<swiper-container style="width:100%;" ref="swiper" direction="horizontal" effect="slide">
				<swiper-slide v-for="(slide,i) of slides" :key="i" style="color:white;">
					<section class="slide-section">
						<h2 v-if="slide?.title" class="slide-title">{{ slide.title }}</h2>
						<img class="slide-image" :src="slide.image"/>
					</section>
				</swiper-slide>
			</swiper-container>
			<BaseButton class="close-session-button" @click="closeSession" prependIcon="mdi-logout">Завершить сессию</BaseButton>
		</ClientOnly>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';

definePageMeta({
	auth: true,
});

function closeSession() {
	const user = useUserStore();
	user.loguot();
}

const swiper = ref(null);
const slides = [
	// {
	// 	title: `Кредитный продукт «Газификация»`,
	// 	image: `https://files.gazprom.kg/images/banner/e75d27674bd27cd4e73b765cdb2a1adf4dfc92073d34d4f4423f01e9a6908bb6.jpg`,
	// },
	// {
	// 	title: ``,
	// 	image: `https://files.gazprom.kg/images/banner/97b119291434cab7eba1a1878df2ca1ae974ef1afddad1478c620ebd141a8923.jpg`
	// },
	{ image: `/banners/1.jpeg` },
	{ image: `/banners/2.jpeg` },
	{ image: `/banners/3.jpeg` },
	{ image: `/banners/4.jpeg` },
	{ image: `/banners/5.jpeg` },
	{ image: `/banners/6.jpeg` },
	{ image: `/banners/7.jpeg` },
	{ image: `/banners/8.jpeg` },
] as Record<string, any>[];
</script>

<style lang="scss">
.index-page {
	position: relative;

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

	.close-session-button {
		z-index: 9999;
		backdrop-filter: blur(10px);
		box-shadow:0 0 4px rgba(0,0,0,0.1);
		background-color: #ffffff44 !important;
		color: #333 !important;
		font-weight:700 !important;
		position: absolute;
		bottom: 1em;
		right: 1em;
		// transform: translateX(-50%);

		.button-text {
			font-weight:700;
		}
	}
}
</style>
