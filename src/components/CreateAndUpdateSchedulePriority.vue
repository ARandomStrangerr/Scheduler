<template>
	<div class='wrapper'>
		<div @click="toggle($event)" class='button low-priority'>Low Priority</div>
		<div @click="toggle($event)" class='button medium-priority'>Medium Priority</div>
		<div @click="toggle($event)" class='button high-priority'>High Priority</div>
	</div>
</template>

<script>
export default{
	props: ['submitData'],
	data(){
		return {
			selectedPriority: ""
		}
	},
	methods: {
		toggle(target) {
			if (this.selectedPriority) this.selectedPriority.classList.toggle('active');
			target.target.classList.toggle('active');
			this.selectedPriority = target.target;
			this.submitData.priority = target.target.innerText;
		}
	},
	mounted() {
		if (this.submitData.priority==="Low Priority") document.querySelector(".button.low-priority").click();
		else if (this.submitData.priority==="Medium Priority") document.querySelector(".button.medium-priority").click();
		else if (this.submitData.priority==="High Priority") document.querySelector(".button.high-priority").click();
	}
}
</script>

<style scoped>
.wrapper {
	display: flex;
	flex-direction: row
}
.wrapper .button {
	flex-grow: 1;
	width: 10em;
	height: 2.5em;
	border-width: 1px;
	border-style: solid;
	border-radius: 0.5em;
	transition: 0.2s;
	margin-right: 1em;
}
.wrapper .button:last-child {
	margin-right: 0em;
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
</style>
