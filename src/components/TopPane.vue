<script setup>
import RightArrow from './icons/RightArrow.vue';
import LeftArrow from './icons/LeftArrow.vue';
import Subscription from './subscription/subscription.js'
</script>
<script>
let monthName = function(date) {
	switch (date) {
		case 0:
		return "January";
		case 1:
		return "Febuary";
		case 2:
		return "March";
		case 3:
		return "April";
		case 4:
		return "May";
		case 5:
		return "Jun";
		case 6:
		return "Junly";
		case 7:
		return "August";
		case 8:
		return "September";
		case 9:
		return "October";
		case 10:
		return "November";
		case 11:
		return "December";
	}
}
let currentDate;
export default {
	methods: {
		getCurrentMonth() {
			currentDate = new Date();
			return monthName(currentDate.getMonth()) + " " + currentDate.getFullYear();
		},
		getNextMonth() {
			currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1);
			this.$refs.monthAndYear.innerText = monthName(currentDate.getMonth()) + " " + currentDate.getFullYear();
			Subscription.notify("viewNextMonth");
		},
		getPrevMonth() {
			currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 1);
			this.$refs.monthAndYear.innerText = monthName(currentDate.getMonth()) + " " + currentDate.getFullYear();
			Subscription.notify("viewLastMonth");
		}
	}
}
</script>
<template>
	<div class="topPane">
		<div class="button" @click='getPrevMonth()'> <LeftArrow /> </div>
		<div class="button" @click='getNextMonth()'> <RightArrow /> </div>
		<div ref='monthAndYear'>{{getCurrentMonth()}}</div>
	</div>
</template>

<style scoped>
.topPane {
	display: flex;
	flex-direction: row;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: #dee2e6;
	padding: 1em;
	font-size: 16px;
	background-color: white;
}
svg {
	width: 1em;
	height: 1em;
}
.button {
	width: 1.5em;
	height: 1.5em;
	border-radius: 50%;
	transition: 0.2s;
	display: flex;
	justify-content: center;
	align-items: center;
}
.button:hover {
	background-color: #edf6f9;
}
</style>
