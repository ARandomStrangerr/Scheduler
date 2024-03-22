<script setup>
defineProps({
	component: {
		type: Object,
		equired: true
	}
})
</script>

<template>
	<div class='background'>
		<slot :component='component' />
	</div>
</template>

<style>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	background-color: #e9ecefb0;
	display:flex;
	justify-content: center;
	align-items: center;
}
</style>
