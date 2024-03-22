<script setup>
import Cross from './icons/Cross.vue'
import Add from './icons/Add.vue'
</script>

<template>
	<div class='form'>
		<input class='title' placeholder='Title'>
		<div class='priority wrapper'>
			<div class='button low-priority'>Low Priority</div>
			<div class='button medium-priority'>Medium Priority</div>
			<div class='button high-priority'>High Prority</div>
		</div>
		<div class='wrapper'>
			<input class='date' v-model='today' placeholder='start date'>
			-
			<input class='date' v-model='today' placeholder='end date'>
		</div>
		<div class='wrapper'>
			<h2>Tasks</h2>
			<div class='button' @click='addElement'><Add /></div>
		</div>
		<div class='task-list'><input placeholder="task name" v-for="(element, index) in elements" :key="index" v-model="elements[index]"></div>
		<div class='wrapper priority'>
			<div class='button green-button'>Create</div>
			<div class='button red-button' @click="$router.push('/')">Cancel</div>
		</div>
	</div>
</template>

<script>
let getStringDate = function (){
	let date = new Date();
	let returnString = "";
	switch (date.getDay()){
		case 0:
			returnString += "Monday, ";
			break;
		case 1:
			returnString += "Tuesday, ";
			break;
		case 2:
			returnString += "Wendnesday, ";
			break;
		case 3:
			returnString += "Thursday, ";
			break;
		case 4:
			returnString += "Friday, ";
			break;
		case 5:
			returnString += "Saturday, ";
			break;
		case 6:
			returnString += "Sunday, ";
			break;
	}
	switch (date.getMonth()) {
		case 0:
			returnString += "January ";
			break;
		case 1:
			returnString += "Febuary ";
			break;
		case 2:
			returnString += "March ";
			break;
		case 3:
			returnString += "April ";
			break;
		case 4:
			returnString += "May ";
			break;
		case 5:
			returnString += "Jun ";
			break;
		case 6:
			returnString += "July ";
			break;
		case 7:
			returnString += "August ";
			break;
		case 8:
			returnString += "September ";
			break;
		case 9:
			returnString += "October ";
			break;
		case 10:
			returnString += "November ";
			break;
		case 11:
			returnString += "December ";
			break;
	}
	returnString += date.getDate() + ", " + date.getFullYear();
	return returnString;
}
export default{
	data() {
		return {
			today: getStringDate(),
			elements: []
		}
	},
	methods: {
		addElement() {
			this.elements.push("");
		}
	}
}
</script>

<style scoped>
.form {
	position: relative;
	padding: 2em;
	border-radius: 1em;
	background-color: white;
	box-shadow: 10px 5px 5px #6c757d;
}
.form > div {
	margin-bottom: 1em;
}
svg{
	width: 1em;
	height: 1em;
}
.title {
	width: 100%;
	font-size: 24px;
	margin-bottom: 1em;
}
.wrapper {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.priority .button {
	flex-grow: 1;
	width: 10em;
	height: 2.5em;
	border-width: 1px;
	border-style: solid;
	display:flex;
	justify-content: center;
	align-items: center;
	border-radius: 0.5em;
	transition: 0.2s;
	margin-right: 1em;
}
.priority div:last-child{
	margin-right: 0px;
}
.low-priority {
	border-color: #dfe7fd;
}
.low-priority:hover {
	background-color: #dfe7fd;
}
.medium-priority {
	border-color: #e2ece9;
}
.medium-priority:hover {
	background-color: #e2ece9;
}
.high-priority {
	border-color: #fde2e4;
}
.high-priority:hover {
	background-color: #fde2e4;
}
.date {
	transition: 0.2s;
	padding: 0.5em;
	border-radius: 0.5em;
	font-size: 14px;
}
.date:hover {
	background-color: #fdf3d9;
}
.date:focus {
	background-color: #fdf3d9;
}
.task-list {
	display: flex;
	flex-direction: column;
}
.task-list input {
	margin-bottom: 0.5em;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: #fdf3d9
}
.green-button {
	border-color: #e2ece9;
}
.green-button:hover {
	background-color: #e2ece9;
}
.red-button {
	border-color: #fde2e4;
}
.red-button:hover {
	background-color: #fde2e4;
}
</style>
