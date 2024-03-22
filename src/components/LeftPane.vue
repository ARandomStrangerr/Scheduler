<script setup>
import {RouterLink, RouterView} from 'vue-router';
</script>

<template>
	<div class='left-pane'>
		<div class='button' @click="$router.push('/create')">Add Schedule</div>
	</div>
	<RouterView />
</template>

<style scoped>
.left-pane {
	padding: 1em;
	background-color: white;
	width: 15%;
	display: flex;
	flex-direction:column;
	border-width: 0px 1px 0px 0px;
	border-style: solid;
	border-color: #dee2e6;
	box-sizing: border-box;
	flex-grow:1;
}

.button {
	color: black;
	background-color: #edf6f9;
	display:inline-block;
	text-align:center;
}
</style>
