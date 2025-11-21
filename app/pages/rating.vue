<template>
	<section class="rating-page">
		<main>
			<section>
				<div class="rating-title">Оцените качество работы оператора</div>
				<div v-if="appStore.currentUser?.fullName" class="rating-username">
					<span>{{ appStore.currentUser.fullName }}</span>
				</div>
			</section>
			<section>
				<div class="grades">
					<div v-for="(color, index) of [ `#d30327`, `#ea0b0c`, `#f13609`, `#f97604`, `#f6b304`, `#f7dd04`, `#cedd12`, `#8ad523`, `#44bc37`, `#14ab4a` ]"
						:key="index"
						:style="{ background: color }"
						class="grade"
						@click="rate(index + 1)">
							{{ index + 1 }}
						</div>
				</div>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/BaseIcon.vue';

const { $api } = useNuxtApp();

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
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2em;

		section:nth-child(1) {
			text-align:center;

			.rating-title {
				margin-bottom:.3em;
				text-align: center;
				font-size: 2.4em;
				font-weight: 700;
			}
			.rating-username {
				opacity:.5;
				line-height:1.4em;
				text-align: center;
				font-size: 1.4em;
				font-weight: 700;
			}
		}
		section:nth-child(2) {
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
	}

}
</style>
