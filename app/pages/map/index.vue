<template>
	<section class="map-page">
		<main class="map-wrapper">
			<YaMap @ready="onMapReady">
				<!-- <div style="position:absolute; top:1em; right:1em; cursor:pointer; z-index: 200;">
					<BaseIcon name="mdi-close" class="close-map" size="2em" @click="$emit('close')"/>
				</div>
				<aside style="position:absolute; top:0; bottom:0; left:0; width:200px; z-index:300; background-color:#ffffff; padding:1.6em; box-shadow:0 0 4px 0 rgb(0 0 0 / 0.14); display:flex; flex-direction:column; gap:.6em;">
					<BaseAutocomplete label="Филиал" v-model="appStore.selectedBranch" autoselect :items="appStore.branchList"/>
					<BaseDatepicker label="От" v-model="form.startDate" placeholder="Сегодня"/>
					<BaseDatepicker label="До" v-model="form.endDate" placeholder="Не указано"/>
					<BaseAutocomplete label="Руководитель" v-model="form.userId" autoselect fieldKey="id" fieldValue="name" :items="[ {id:``, name:`Все`}, ...appStore.supervisorList ]"/>
					<BaseAutocomplete label="Исполнитель" v-model="form.assigneeId" autoselect fieldKey="id" fieldValue="name" :items="[ {id:``, name:`Все`}, ...appStore.assigneeList ]"/>
					<BaseButton @click="fetchTrips" prependIcon="mdi-check">Применить</BaseButton>
				</aside> -->
			</YaMap>
		</main>
		<footer class="footer">
			<BaseButton style="flex:auto 1 0;" append-icon="mdi-arrow-right">ДАЛЕЕ</BaseButton>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';
import YaMap from './YaMap.vue';
import type { YMap } from "@yandex/ymaps3-types";

let map = ref(null) as YMap | null;

function onMapReady(map: YMap) {
	map.value = map;
	// fetchTrips();
};
</script>

<style lang="scss">
.map-page {
	$padding-size: .6em;
	height: 100vh;
	display: flex;
	gap:$padding-size;
	flex-direction: column;
	// margin:auto auto;

	.map-wrapper {
		position: relative;
		padding:$padding-size $padding-size 0 $padding-size;
		flex:auto 1 0;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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
