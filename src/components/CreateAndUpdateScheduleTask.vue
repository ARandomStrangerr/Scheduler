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
<div class='task-list' v-for="(task, index) in tasks">
	<div class="wrapper" :key="index">
		<div class="button green-button"><Check /></div>
		<input placeholder="task name" v-model="task.taskName">
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
</template>

<script>
export default {
	data(){
		return {
			tasks:[]
		}
	},
	methods: {
		addTask(type){
			this.tasks.push({type: type});
		},
		deleteTask(index){
			this.tasks.splice(index,1);
		}
	}
}
</script>

<style>
.wrapper {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
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
}
input {
	margin-bottom: 0.5em;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: #fdf3d9
}
</style>
