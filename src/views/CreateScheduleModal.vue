<script setup>
import Veil from '../components/Veil.vue'
import Priority from '../components/CreateAndUpdateSchedulePriority.vue'
import Task from '../components/CreateAndUpdateScheduleTask.vue'
</script>

<template>
	<Veil>
		<form>
			<input class='title' placeholder='Title' v-model='formData.title'>
			<Priority :submitData="formData"/>
			<Task/>
			<div class='wrapper'>
				<div class='button green-button' @click='submitForm'>Create</div>
				<div class='button red-button' @click="$router.push('/')">Cancel</div>
			</div>
		</form>
	</Veil>
</template>

<script>
export default {
	props: {
		submitData: {
			type: Object,
			require: true
		}
	},
	data() {
		return {
			formData: {
				taskName: "",
				priority: "",
				tasks:[]
			}
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
.form::-webkit-scrollbar {
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
</style>
