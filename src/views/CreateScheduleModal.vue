<script setup>
import Subscription from '../components/subscription/subscription.js'
import Veil from '../components/Veil.vue'
import Priority from '../components/CreateAndUpdateSchedulePriority.vue'
import Task from '../components/CreateAndUpdateScheduleTask.vue'
import Axios from 'axios'
</script>

<template>
	<Veil>
		<form @submit.prevent="submitForm">
			<input class='title' placeholder='Title' v-model='formData.scheduleName'>
			<Priority :submitData="formData"/>
			<Task :submitData="formData"/>
			<div class='wrapper'>
				<div class='button green-button' @click='submitForm'>Create</div>
				<div class='button red-button' @click="$router.push('/')">Cancel</div>
			</div>
		</form>
	</Veil>
</template>

<script>
export default {
	inject: ['expressAddress'],
	props: {
		submitData: {
			type: Object,
			require: true
		}
	},
	data() {
		return {
			formData: {
				priority: "",
				tasks:[]
			}
		}
	},
	methods: {
		submitForm() {
			if (!this.formData.scheduleName || this.formData.title === ""){
				Subscription.notify("notification", "Title of the task is empty", "error");
				return;
			}
			if (this.formData.priority === ""){
				Subscription.notify("notification", "Priority of the task is not selected", "error");
				return;
			}
			for (let task of this.formData.tasks){
				if(!task.taskName || task.taskName === ""){
					Subscription.notify("notification", "There is a sub-task name is missing", "error");
					return;
				}
				if (task.startDate) {
					task.startTimeFirstOccurence = `${task.startDate}T${task.startHour}:${task.startMinute}:00Z`;
					delete task.startDate;
					delete task.startHour;
					delete task.startMinute;
				}
				if (task.lastOccurence) task.lastOccurence = `${task.lastOccurence}T23:59:59Z`;
				else task.lastOccurence = `${task.endDate}T23:59:59Z`;
				task.endTimeFirstOccurence = `${task.endDate}T${task.endHour}:${task.endHour}:00Z`;
				delete task.endDate;
				delete task.endHour;
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
form {
	padding: 2em;
	border-radius: 1em;
	background-color: white;
	box-shadow: 10px 5px 5px #6c757d;
	max-height:80vh;
	overflow-y: scroll;
}
form::-webkit-scrollbar {
	display:none;
}
.title {
	width: 100%;
	font-size: 24px;
	margin-bottom: 1em;
}
.button {
	flex-grow: 1;
	width: 10em;
	height: 2.5em;
	border-width: 1px;
	border-style: solid;
	border-radius: 0.5em;
	transition: 0.2s;
	margin-right: 1em;
}
.button:last-child {
	margin-right: 0em;
}
.wrapper {
	display: flex;
	flex-direction: row;
}
</style>
