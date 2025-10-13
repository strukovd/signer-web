<template>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>



<script lang="ts" setup>
useHead({
	link: [
		{
			rel: 'preconnect',
			href: 'https://fonts.googleapis.com',
		},
		{
			rel: 'preconnect',
			href: 'https://fonts.gstatic.com',
			crossorigin: true,
		},
		{
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap',
		},
	],

})
</script>

<style lang="scss">
body {
	margin: 0;
	// height:100vh;
	background-color: #e0f2fe;
    color: #183d6d;
    font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
}
</style>
