<script setup>
import Cross from './icons/Cross.vue'
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
			<h2>Tasks</h2>
			<div class='button' @click='add("deadline")'>Add Deadline</div>
			<div class='button' @click='add("schedule")'>Add Schedule</div>
		</div>
		<div class='task-list' v-for="(task, index) in formData.tasks">
			<div class="wrapper" :key="index">
				<div class="button green-button"><Check /></div>
				<input placeholder="task name" v-model="task.task">
				<div class="button red-button" @click="deleteTask(index)"><Cross /></div>
			</div>
			<div class='wrapper' v-if="task.type==='schedule'">
				Start
				<input type='date' placeholder='start' v-model="task.startDate">
				Hour
				<input type="number" min="0" max="23" placeholder="HH" v-model="task.starHour" ref="startHour" value="00" oninput="this.value=this.value.replace(/(?![0-9])./gmi,'')">
				Minute
				<input type="number" min="0" max="60" placeholder="mm" value="00" v-model="task.startMinute" ref="startMinute" oninput="this.value=this.value.replace(/(?![0-9])./gmi,'')">
			</div>
			<div class='wrapper'>
				End
				<input type='date' placeholder='deadline' ref="deadlineDate" v-model="task.endDate">
				Hour
				<input type="number" min="0" max="23" placeholder="HH" v-model="task.endHour" ref="endHour" value="00" oninput="this.value=this.value.replace(/(?![0-9])./gmi,'')">
				Minute
				<input type="number" min="0" max="60" placeholder="mm" value="00" v-model="task.endMinute" ref="endMinute" oninput="this.value=this.value.replace(/(?![0-9])./gmi,'')">
			</div>
			<textarea placeholder='note' rows='2' v-model='task.note' />
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
export default {
	inject: ['expressAddress'],
	data() {
		return {
			today: getStringDate(),
			formData: {
				title: "",
				priority: "",
				tasks: []
			}
		}
	},
	methods: {
		add(type) {
			this.formData.tasks.push({type: type});
			console.log(this.formData.tasks)
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
			if (!this.formData.title || this.formData.title.trim() === ""){
				Subscription.notify("notification", "Tittle of the schedule is empty", "error");
				return;
			} else if (this.formData.priority===""){
				Subscription.notify("notification", "Priority of the schedule has not been selected", "error");
				return;
			}
			for (let task of this.formData.tasks){
				if (!task.task || task.task.trim() === "") {
					Subscription.notify("notification", "Task name is empty", "error");
					return;
				} else if (!task.endDate) {
					Subscription.notify("notification", "Deadline for the task has not been selected", "error");
					return;
				} else if (task.endHour && (task.endHour<0 || task.endHour>=24)) {
					Subscription.notify("notification", "Incorrect hour format for task", "error");
					return;
				} else if (task.endMinute && (task.endMinute<0 || task.endMinute>=60)) {
					Subscription.notify("notification", "Incorrect minute format for task", "error");
					return;
				}
				task.end = `${task.endDate}T${task.endHour?task.endHour:"00"}:${task.endMinute?task.endMinute:"00"}:00Z`;
				let today = new Date();
				let deadlineDay = new Date(task.start);
				if (today > deadlineDay) {
					Subscription.notify("notification", "Deadline cannot be before the current time", "error");
					return;
				}
				if(task.type === 'schedule') task.start = `${task.startDate}T${task.startHour?task.startHour:"00"}:${task.startMinute?task.startMinute:"00"}:00Z`;
				delete task.startDate;
				delete task.endDate;
				delete task.startHour;
				delete task.endHour;
				delete task.startMinute;
				delete task.endMinute;
			}
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
	max-height:80vh;
	overflow-y: scroll;
}
.form::-webkit-scrollbar {
	display:none;
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
.task-list {
	display: flex;
	flex-direction: column;
}
input {
	margin-bottom: 0.5em;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: #fdf3d9
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
textarea {
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: #fdf3d9;
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
