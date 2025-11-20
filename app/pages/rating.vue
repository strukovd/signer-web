<template>
	<section class="rating-page">
		<main class="rating-wrapper">
			<h1>Оцените качество работы оператора</h1>
			<div>{{ appStore.currentUser }}</div>
			<div class="grades">
				<div style="background:#d30327;" class="grade" @click="rate(1)">1</div>
				<div style="background:#ea0b0c;" class="grade" @click="rate(2)">2</div>
				<div style="background:#f13609;" class="grade" @click="rate(3)">3</div>
				<div style="background:#f97604;" class="grade" @click="rate(4)">4</div>
				<div style="background:#f6b304;" class="grade" @click="rate(5)">5</div>
				<div style="background:#f7dd04;" class="grade" @click="rate(6)">6</div>
				<div style="background:#cedd12;" class="grade" @click="rate(7)">7</div>
				<div style="background:#8ad523;" class="grade" @click="rate(8)">8</div>
				<div style="background:#44bc37;" class="grade" @click="rate(9)">9</div>
				<div style="background:#14ab4a;" class="grade" @click="rate(10)">10</div>
			</div>
		</main>
		<!-- <footer class="footer">
			<BaseButton @click="appStore.nextPage()" style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer> -->
	</section>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();
import BaseButton from '~/components/common/BaseButton.vue';

const appStore = useAppStore();

async function rate(grade: number) {
	const issueKey = appStore.pageParams().issueKey;
	const operator = appStore.login;

	$api('v1/office-app/rating', {
		headers: { 'auth-token': localStorage.getItem('token') } as Record<string, string>,
		method: 'POST',
		body: {
			issueKey,
			grade: 10,
			operator: operator,
		},
	})
		.then((data) => {
			appStore.nextPage();
			// if(data.accessToken) {
			// 	useUserStore().setData(data);
			// 	navigateTo('/');
			// }
		})
		// .catch((err: FetchError) => {
		// 	error.value = err.message;
		// });
}
</script>

<style lang="scss">
.rating-page {
	.rating-wrapper {
		h1 {
			text-align: center;
			font-size: 2.4em;
			font-weight: 700;
		}
		.grades {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: end;
			gap: 1em;


			.grade {
				text-align: center;
				line-height: 2em;
				width:2em;
				color: #fff;
				font-size:3.4dvw;
				text-align: center;
				border-radius:30%;
				cursor: pointer;

				&:hover {
					opacity: .7;
				}
			}
		}
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
