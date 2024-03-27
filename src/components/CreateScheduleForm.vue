<script setup>
import Cross from './icons/Cross.vue'
import Add from './icons/Add.vue'
import Check from './icons/Check.vue'
import Axios from 'axios'
import Subscription from './subscription/subscription.js'
</script>

<template>
	<form class='form' @submit.prevent='submitForm'>
		<input class='title' placeholder='Title' v-model='formData.title'>
		<div class='priority wrapper'>
			<div @click="toggle($event)" class='button low-priority'>Low Priority</div>
			<div @click="toggle($event)" class='button medium-priority'>Medium Priority</div>
			<div @click="toggle($event)" class='button high-priority'>High Priority</div>
		</div>
		<div class='wrapper'>
			<input class='date' v-model='formData.startDate' placeholder='start date'>
			-
			<input class='date' v-model='formData.endDate' placeholder='end date'>
		</div>
		<div class='wrapper'>
			<h2>Tasks</h2>
			<div class='button' @click='addTask()'><Add /></div>
		</div>
		<div class='task-list'>
			<div class="wrapper" v-for="(task, index) in formData.tasks" :key="index">
				<div class="button green-button"><Check /></div>
				<input placeholder="task name" @blur="inputOnChange($event, index)" :value="task">
				<div class="button red-button" @click="deleteTask(index)"><Cross /></div>
			</div>
		</div>
		<div class='wrapper priority'>
			<div class='button green-button' @click='submitForm'>Create</div>
			<div class='button red-button' @click="$router.push('/')">Cancel</div>
		</div>
	</form>
</template>

<script>
let getStringDate = function (){
	let date = new Date();
	return `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`;
}
let selectedPriority;
let togglePriority = function (target) {
	if (selectedPriority) selectedPriority.classList.toggle('active');
	target.classList.toggle('active');
	selectedPriority = target;
}
let getTaskContainer = function() {
	let input = document.createElement('input');
	let deleteButton = document.createElement('input');
	let wrapper = document.createElement('div');
	wrapper.appendChid(input);
	wrapper.appendChild(deleteButton);
	wrapper.classList.add("wrapper");
	deleteButton.onClick = () => wrapper.remove();
}
export default{
	inject: ['expressAddress'],
	data() {
		return {
			today: getStringDate(),
			formData: {
				title: "",
				priority: "",
				startDate: getStringDate(),
				endDate: getStringDate(),
				tasks: []
			}
		}
	},
	methods: {
		addTask() {
			this.formData.tasks.push("");
		},
		deleteTask(index) {
			this.formData.tasks.splice(index, 1);
		},
		inputOnChange(event, index){
			this.formData.tasks[index] = event.target.value;
		},
		toggle(event){
			togglePriority(event.target);
			this.formData.priority = event.target.innerText
		},
		submitForm() {
			Axios.post(`${this.expressAddress}/create`, this.formData)
				.then((response) => {
					Subscription.notify('notification', response.data, 'success');
					this.$router.push('/');
				}).catch((response) => {
					Subscription.notify("notification", response.response.data, "error");
				});
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
.task-list > .wrapper {
	margin-bottom: 0.5em;
}
.task-list > .wrapper > input {
	flex-grow: 1;
	margin: 0em 1em 0em 1em;
}
.task-list > .wrapper > .button {
	width: 1.5em;
	height: 1.5em;
}
.priority .button {
	flex-grow: 1;
	width: 10em;
	height: 2.5em;
	border-width: 1px;
	border-style: solid;
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
.low-priority.active {
	background-color: #cddafd;
}
.medium-priority {
	border-color: #e2ece9;
}
.medium-priority:hover {
	background-color: #e2ece9;
}
.medium-priority.active{
	background-color: #bee1e6;
}
.high-priority {
	border-color: #fde2e4;
}
.high-priority:hover {
	background-color: #fde2e4;
}
.high-priority.active {
	background-color: #fad2e1;
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
