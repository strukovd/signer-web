<template>
	<section class="index-page">
		<ClientOnly>
			<swiper-container style="width:100%;" ref="swiper" direction="horizontal" effect="slide">
				<swiper-slide v-for="(slide,i) of slides" :key="i" style="color:white;">
					<section class="slide-section">
						<h2 class="slide-title">{{ slide.title }}</h2>
						<img class="slide-image" :src="slide.image"/>
					</section>
				</swiper-slide>
			</swiper-container>
		</ClientOnly>
	</section>
</template>

<script lang="ts" setup>
definePageMeta({
	auth: true,
});

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
];
</script>

<style lang="scss">
.index-page {
	swiper-slide {
		display: flex;
		justify-content: center;
		align-items: center;

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
}
</style>
