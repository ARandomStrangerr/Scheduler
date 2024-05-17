<script setup>
import Check from './icons/Check.vue'
import Cross from './icons/Cross.vue'
</script>

<template>
<div class='wrapper'>
	<h2>Tasks</h2>
	<div class='button' @click='addTask("deadline")'>Add Deadline</div>
	<div class='button' @click='addTask("schedule")'>Add Schedule</div>
</div>
<div class='task-list' v-for="(task, index) in submitData.tasks">
	<div class="wrapper" :key="index">
		<div class="button green-button"><Check /></div>
		<input placeholder="task name" v-model="task.taskName">
		<div class="button red-button" @click="deleteTask(index)"><Cross /></div>
	</div>
	<div class='wrapper' v-if="task.type==='schedule'">
		Start
		<input type='date' placeholder='start' v-model="task.startDate">
		Hour
		<input type="number" min="0" max="23" placeholder="HH" v-model="task.startHour" ref="startHour" value="00" oninput="this.value=this.value.replace(/(?![0-9])./gmi,'')">
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
	<div class='wrapper'>
		<div>Repeat</div>
		<div :class='{"button": true,"day":true, "active":task.repeatPattern[0]}' @click="toggleRepeatDay(index, 0)">S</div>
		<div :class='{"button": true,"day":true, "active":task.repeatPattern[1]}' @click="toggleRepeatDay(index, 1)">M</div>
		<div :class='{"button": true,"day":true, "active":task.repeatPattern[2]}' @click="toggleRepeatDay(index, 2)">T</div>
		<div :class='{"button": true,"day":true, "active":task.repeatPattern[3]}' @click="toggleRepeatDay(index, 3)">W</div>
		<div :class='{"button": true,"day":true, "active":task.repeatPattern[4]}' @click="toggleRepeatDay(index, 4)">T</div>
		<div :class='{"button": true,"day":true, "active":task.repeatPattern[5]}' @click="toggleRepeatDay(index, 5)">F</div>
		<div :class='{"button": true,"day":true, "active":task.repeatPattern[6]}' @click="toggleRepeatDay(index, 6)">S</div>
		<div>Every<input class="week" type="number" placeholder="week" v-model='task.repeatPattern[7]'></div>
	</div>
	<div class='wrapper'>
		<div>Last Occurance</div>
		<input type="date" v-model='task.lastOccurence'>
	</div>
	<textarea placeholder='note' rows='2' v-model='task.note' />
</div>
</template>

<script>
export default {
	props: ['submitData'],
	data(){
		return {
		}
	},
	methods: {
		addTask(type){
			this.submitData.tasks.push({type: type, repeatPattern:[0, 0, 0, 0, 0, 0, 0, 0], complete: false});
		},
		deleteTask(index){
			this.submitData.tasks.splice(index,1);
		},
		toggleRepeatDay(index, day){
			if (this.submitData.tasks[index].repeatPattern[day]) this.submitData.tasks[index].repeatPattern[day] = 0;
			else this.submitData.tasks[index].repeatPattern[day] = 1;
		},
	}
}
</script>

<style scoped>
.wrapper {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 0.5em;
}
.wrapper:last-child{
	margin-bottom: 0em;
}
svg{
	width: 1em;
	height: 1em;
}
.task-list > .wrapper > .button {
	width: 1.5em;
	height: 1.5em;
}
textarea {
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: #fdf3d9;
	width: 100%;
}
input {
	margin-bottom: 0.5em;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: #fdf3d9;
	margin: 0em 1em 0em 1em;
	flex-grow:1;
}
.week{
	width: 4em;
}
.day {
	border-color: #e2ece9;
}
.day:hover {
	background-color: #fdf3d9;
}
.day.active {
	background-color: #fdf3d9;
}
</style>
