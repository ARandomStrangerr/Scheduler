<template>
	<div class='right-pane' ref='calendarContainer'>
		<div class="day row">
			<div class='cell'>Sun</div>
			<div class='cell'>Mon</div>
			<div class='cell'>Tue</div>
			<div class='cell'>Wen</div>
			<div class='cell'>Thu</div>
			<div class='cell'>Fri</div>
			<div class='cell'>Sat</div>
		</div>
		<div v-for="(row, i) of dates" :key='i' class='row'>
			<div v-for="(cell, j) of row" :key='j' class='cell'>
				<div :class="{'button': true, 'today':cell.today, 'not-in-month':cell.notInMonth}">{{cell.date}}</div>
				<div v-for="(task,k) of cell.tasks" :key="k" :class="{ 'low-priority':task.parent.priority==='Low Priority', 'medium-priority':task.parent.priority==='Medium Priority', 'high-priority':task.parent.priority==='High Priority', 'active':task.active}" @mouseover="onMouseOver(task)" @mouseout="onMouseOut(task)" @click="redirectToUpdatePage(task)">{{task.task}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import Subscription from './subscription/subscription.js';
import Axios from 'axios';
import { ref } from 'vue';
export default {
	inject: ['expressAddress'],
	data(){
		return {
			today: new Date(),
			viewMonthYear: new Date(),
			dates: []
		}
	},
	methods: {
		async createDateList (month, year) {
			let rows = [];
			let lastDayPrevMonth = new Date(year, month - 1, 0);
			let firstDayThisMonth = new Date(year, month - 1, 1);
			let lastDayThisMonth = new Date (year, month, 0);
			let row = [];
			for (let date = lastDayPrevMonth.getDate() - firstDayThisMonth.getDay() + 1; date <= lastDayPrevMonth.getDate(); date++){
				row.push({
					date: date,
					tasks: [],
					notInMonth: true
				});
			}
			for (let date = 1; date <= lastDayThisMonth.getDate(); date++){
				row.push({
					date: date,
					tasks: []
				});
				if (row.length===7){
					rows.push(row);
					row=[];
				}
			}
			for (let date = 1; row.length < 7; date++) {
				row.push({
					date: date,
					tasks: [],
					notInMonth: true,
				});
				if (row.length===7) rows.push(row);
			}
			let response = await Axios.get(`${this.expressAddress}/get-calendar`, {
				params: {
					start: new Date(year, month - 1, 1 - (firstDayThisMonth.getDay())),
					end: new Date(year, month - 1, lastDayThisMonth.getDate() + 7 - (lastDayThisMonth.getDate() + firstDayThisMonth.getDay()) % 7)
				}
			});
			for (let task of response.data) {
				let end = new Date(task.end);
				let columnIndex = (end.getDate() + firstDayThisMonth.getDay()) % 7 != 0 ? (end.getDate() + firstDayThisMonth.getDay()) % 7 - 1 : 6;
				let rowIndex = columnIndex != 6 ? Math.floor((end.getDate() + firstDayThisMonth.getDay()) / 7) : Math.floor((end.getDate() + firstDayThisMonth.getDay()) / 7) - 1;
				rows[rowIndex][columnIndex].tasks.push(task);
				task.active = ref(false);
				Subscription.subscribe(`${task.parent._id}MouseOver`, () => { // memory leak here, we need to unsub this when it does not need
					task.active.value = true;
				});
				Subscription.subscribe(`${task.parent._id}MouseOut`, () => { // memory leak here, we need to unsub this when it does not need
					task.active.value = false;
				});
			}
			let colIndex = (this.today.getDate() + firstDayThisMonth.getDay()) % 7 != 0 ? (this.today.getDate() + firstDayThisMonth.getDay()) % 7 - 1 : 6;
			let rowIndex = colIndex != 6 ? Math.floor((this.today.getDate() + firstDayThisMonth.getDay()) / 7) : Math.floor((this.today.getDate() + firstDayThisMonth.getDay()) / 7) - 1;
			rows[rowIndex][colIndex].today = true;
			this.dates = rows;
		},
		onMouseOver(task){
			Subscription.notify(`${task.parent._id}MouseOver`);
		},
		onMouseOut(task){
			Subscription.notify(`${task.parent._id}MouseOut`);
		},
		redirectToUpdatePage(task){
			this.$router.push(`/update/${task.parent._id}`);
		}
	},
	async mounted() {
		await this.createDateList(this.viewMonthYear.getMonth() + 1, this.viewMonthYear.getFullYear());
			Subscription.subscribe("viewNextMonth", () => {
			this.viewMonthYear.setMonth(this.viewMonthYear.getMonth() + 1);
			this.createDateList(this.viewMonthYear.getMonth() + 1, this.viewMonthYear.getFullYear());
		});
		Subscription.subscribe("viewLastMonth", () => {
			this.viewMonthYear.setMonth(this.viewMonthYear.getMonth() - 1);
			this.createDateList(this.viewMonthYear.getMonth() + 1, this.viewMonthYear.getFullYear());
		});
	}
}
</script>

<style scoped>
.right-pane {
	width: 85%;
	background-color: white;
	display: flex;
	flex-direction: column;
	flex-grow:1;
}
.row {
	display: flex;
	flex-direction: row;
	flex-grow:1;
	flex-basis: 0;
	width: 100%;
	border-width: 0px 0px 1px 0px;
	border-style:solid;
	border-color: #dee2e6;
	box-sizing: border-box;
}
.row:last-child {
	border-width: 0px;
}
.row.cell:last-child {
	border-width: 0px;
}
.day {
	height: 2em;
	border-bottom:0px;
	flex-grow:0;
}
.today {
	background-color: #fbecc1;
}
.not-in-month{
	color: #ced4da;
}
.cell {
	flex-grow: 0;
	padding-top: 0.5em;
	width: calc(100%/7);
	display: flex;
	flex-direction: column;
	align-items: center;
	border-right:1px;
	border-top:0px;
	border-left:0px;
	border-bottom: 0px;
	border-style:solid;
	border-color: #dee2e6;
	box-sizing: border-box;
}
.cell > div:first-child {
	width: 1.8em;
	height: 1.8em;
	border-radius: 50%;
	margin-bottom: 0.5em;
	display:flex;
	justify-content: center;
	align-items: center;
	margin-right: 0em;
}
.cell > div {
	width: 90%;
	border-radius: 0px 5px 5px 0px;
	transition: 0.2s;
	margin-right: 1em;
}
.cell > div:first-child:hover {
	background-color: #edf6f9;
}
.cell:nth-last-child() {
	border-width: 0px;
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
	background-color: #bee1e6;
}
.high-priority {
	background-color: #fde2e4;
}
.high-priority.active {
	background-color: #fad2e1;
}
</style>
