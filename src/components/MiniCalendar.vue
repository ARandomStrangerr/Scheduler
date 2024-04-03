<script setup>
import LeftArrow from '../icons/LeftArrow.vue';
import RightArrow from '../icons/RightArrow.vue';
</script>
<template>
	<div class='mini-calendar'>
		<div class='top'>
			<div class='buttons'>
				<div class='button'><LeftArrow /></div>
				<div class='button'>Today</div>
				<div class='button'><RightArrow /></div>
			</div>
			<input placeholder="hh:mm">
		</div>
	</div>
</template>

<style scoped>
</style>
