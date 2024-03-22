<script setup>
import TopPane from '../components/TopPane.vue'
import LeftPane from '../components/LeftPane.vue'
import RightPane from '../components/RightPane.vue'
</script>

<template>
	<header>
		<TopPane />
	</header>
	<main>
		<LeftPane />
		<RightPane />
	</main>
</template>

<style scoped>
main {
	width:100vw;
	display:flex;
	flex-direction:row;
	flex-grow:1;
}
</style>
