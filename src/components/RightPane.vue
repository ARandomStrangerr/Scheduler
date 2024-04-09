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
				<div class='button'>{{cell.date}}</div>
				<div class="class " v-for="(task,k) of cell.tasks" :key="k">{{task.task}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import Subscription from './subscription/subscription.js';
import Axios from 'axios';

export default {
	inject: ['expressAddress'],
	data(){
		return {
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
					tasks: []
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
					tasks: []
				});
				if (row.length===7) rows.push(row);
			}
			let response = await Axios.get(`${this.expressAddress}/get-calendar`, {
				params: {
					start: new Date(year, month - 1, 1 - (firstDayThisMonth.getDay())),
					end: new Date(year, month - 1, lastDayThisMonth.getDate() + 7 - (lastDayThisMonth.getDate() + firstDayThisMonth.getDay()) % 7)
				}
			});
			for (let task of response.data){
				let end = new Date(task.end);
				let columnIndex = (end.getDate() + firstDayThisMonth.getDay()) % 7 != 0 ? (end.getDate() + firstDayThisMonth.getDay()) % 7 - 1 : 6;
				let rowIndex = columnIndex != 6 ? Math.floor((end.getDate() + firstDayThisMonth.getDay()) / 7) : Math.floor((end.getDate() + firstDayThisMonth.getDay()) / 7) - 1;
				rows[rowIndex][columnIndex].tasks.push(task);
			}
			this.dates = rows;
		}
	},
	mounted() {
		this.createDateList(4,2024);
	}
}
</script>

<style>
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

.cell {
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
	display:flex;
	justify-content: center;
	align-items: center;
}
.cell > div:hover {
	background-color: #edf6f9;
}
.today > div {
	background-color: #fbecc1;
}

.not-in-month{
	color: #ced4da;
}

.cell:nth-last-child() {
	border-width: 0px;
}
</style>
