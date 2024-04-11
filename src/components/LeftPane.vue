<script setup>
import {ref} from 'vue'
import {RouterLink, RouterView} from 'vue-router';
import Axios from 'axios'
import Subscription from './subscription/subscription.js'
</script>

<template>
	<div class='left-pane'>
		<div class='button' @click="$router.push('/create')">Add Schedule</div>
		<div v-for='(schedule, index) of schedules' :key='schedule.id' :class="{'schedule':true, 'low-priority':schedule.priority==='Low Priority', 'mediun-priority':schedule.priority==='Medium Priority', 'high-priority':schedule.priority==='High Priority', 'active':schedule.active}" @click="redirectToUpdatePage(schedule)" @mouseover="mouseOver(schedule)" @mouseout="mouseOut(schedule)">
			{{schedule.title}}
		</div>
	</div>
	<RouterView />
</template>

<script>
export default {
	inject:['expressAddress'],
	data() {
		return {
			schedules: []
		}
	},
	methods: {
		redirectToUpdatePage(schedule) {
			this.$router.push(`/update/${schedule._id}`);
		},
		mouseOver(schedule) {
			Subscription.notify(`${schedule._id}MouseOver`);
		},
		mouseOut(schedule) {
			Subscription.notify(`${schedule._id}MouseOut`);
		}
	},
	mounted() {
		Axios.get(`${this.expressAddress}/get-schedules`)
			.then((response) => {
				this.schedules = response.data;
				for (let schedule of response.data) {
					schedule.active = ref(false);
					Subscription.subscribe(`${schedule._id}MouseOver`,() => {
						schedule.active.value = true;
					});
					Subscription.subscribe(`${schedule._id}MouseOut`,() => {
						schedule.active.value = false;
					});
				}
			})
			.catch((response) => {
				console.log(response);
				Subscription.notify('notification', response.response.data, 'error');
			})
	}
}
</script>

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

.schedule {
	margin-top:1em;
	border-radius: 5px;
	padding:0.5em;
	cursor: pointer;
}
.low-priority {
	background-color: #dfe7fd;
}
.low-priority.active {
	background-color: #cddafd;
}
.medium-priority {
	background-color: #e2ece9;
}
.medium-priority.active {
	background-color: #e2ece9;
}
.high-priority {
	background-color: #fde2e4;
}
.high-priority.active {
	background-color: #fad2e1;
}
</style>
