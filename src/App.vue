<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue'
</script>

<template>
	<HomeView />
</template>

<style>
#app{
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction:column;
}
</style>
