<script setup>
import Veil from '../components/Veil.vue'
import Priority from '../components/CreateAndUpdateSchedulePriority.vue'
import Task from '../components/CreateAndUpdateScheduleTask.vue'
import UpdateScheduleForm from '../components/UpdateScheduleForm.vue'
import Axios from 'axios'
import Subscription from '../components/subscription/subscription.js'
</script>

<template>
	<Veil>
		<form @submit.prevent="submitForm">
			<input class='title' placeholder='Title' v-model='formData.scheduleName'>
			<Priority :submitData="formData"/>
			<Task :submitData="formData"/>
			<div class='wrapper'>
				<div class='button green-button' @click='submitForm'>Update</div>
				<div class='button red-button' @click='deleteSchedule'>Delete</div>
				<div class='button yellow-button' @click="$router.push('/')">Cancel</div>
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
			formData: {}
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
			Axios.put(`${this.expressAddress}/update-schedule/${this.$route.params.id}`, this.formData)
				.then((response) => {
					Subscription.notify('notification', response.data, 'success');
					this.$router.push('/');
				}).catch((response) => {
					Subscription.notify("notification", response.response.data, "error");
				});
		},
		deleteSchedule(){
			Axios.delete(`${this.expressAddress}/delete-schedule/${this.$route.params.id}`);
			this.$router.push('/');
		}
	},
	async mounted() {
		let returnData = await Axios.get(`${this.expressAddress}/get-schedule/${this.$route.params.id}`);
		this.formData = returnData.data;
		for (let task of this.formData.tasks){
			if (task.startTimeFirstOccurence){
				task.startTimeFirstOccurence = task.startTimeFirstOccurence.split("T");
				task.startTimeFirstOccurence[1] = task.startTimeFirstOccurence.split(":");
				task.startDate = task.startTimeFirstOccurence[0];
				task.startHour = task.startTimeFirstOccurence[1][0];
				task.startMinute = task.startTimeFirstOccurence[1][1];
				delete task.startTimeFirstOccurence;
			}
			task.endTimeFirstOccurence = task.endTimeFirstOccurence.split("T");
			task.endTimeFirstOccurence[1] = task.endTimeFirstOccurence[1].split(":");
			task.endDate = task.endTimeFirstOccurence[0];
			task.endHour = task.endTimeFirstOccurence[1][0];
			task.endMinute = task.endTimeFirstOccurence[1][1];
			delete task.endTimeFirstOccurence;
			task.lastOccurence = task.lastOccurence.split("T")[0];
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
button {
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
