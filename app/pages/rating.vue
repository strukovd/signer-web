<template>
	<section class="rating-page">
		<main>
			<section>
				<div class="rating-title">Просим Вас <br/>оценить качество обслуживания</div>
				<div v-if="appStore.currentUser?.fullName" class="rating-username">
					<span>{{ appStore.currentUser.fullName }}</span>
				</div>
			</section>
			<section>
				<div class="grades">
					<div v-for="(color, index) of [ `#d30327`, `#f97604`, `#f7dd04`, `#8ad523`, `#14ab4a` ]" :key="index" class="grade" @click="rate( (index+1)*2 )">
						<img :src="`/smiles/${index + 1}.svg`">
						<div class="underline" :style="{ background: color }"></div>
					</div>
				</div>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import type { FetchError } from 'ofetch';
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
			grade,
			operator: operator,
		},
	})
		.then((data: any) => {
			appStore.nextPage();
			// if(data.accessToken) {
			// 	useUserStore().setData(data);
			// 	navigateTo('/');
			// }
		})
		.catch((err: FetchError) => {
			useToast().show({
				message: err?.data?.message ?? err?.response?.message ?? err,
				position: "topRight",
				pauseOnHover: true,
				timeout: 10000,
				color: "red",
				transitionIn: "fadeIn",
				transitionOut: "fadeOut",
			});
			appStore.error = err?.data?.message ?? err?.response?.message ?? err;
		});
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
				font-size: 3.0dvw;
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
				// gap: 1em;


				.grade {
					text-align: center;
					width:2em;
					color: #fff;
					font-size:3.6dvw;
					cursor: pointer;
					display:flex;
					flex-direction:column;
					gap:.4em;

					&:hover {
						opacity: .7;
					}

					img {
						margin:0 .1em;
					}

					.underline {
						display: inline-block;
						background: #0079C1;
						height: .3em;
						width: 100%;

					}
					$bradius: 6px;
					&:first-child {
						.underline {
							border-radius: $bradius 0 0 $bradius;
						}
					}
					&:last-child {
						.underline {
							border-radius: 0 $bradius $bradius 0;
						}
					}
				}
			}
		}
	}

}
</style>
