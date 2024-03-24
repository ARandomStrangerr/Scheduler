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
	</div>
</template>

<script>
import Subscription from './subscription/subscription.js';
let createCalendar = function(month, year){
	let rows = []
	let id = 1;
	let lastDayPrevMonth = new Date(year, month - 1, 0);
	let firstDayThisMonth = new Date(year, month - 1, 1);
	let lastDayThisMonth = new Date (year, month, 0);
	let today = new Date();
	let row = document.createElement('div');
	for (let date = lastDayPrevMonth.getDate() - firstDayThisMonth.getDay() + 1; date <= lastDayPrevMonth.getDate(); date++){
		let dateContainer = document.createElement('div');
		dateContainer.innerText = date;
		dateContainer.classList.add('button');
		let cell = document.createElement('div');
		cell.classList.add('cell');
		cell.classList.add('not-in-month');
		cell.appendChild(dateContainer);
		row.appendChild(cell);
	}
	for (let date = 1; date <= lastDayThisMonth.getDate(); date++){
		let dateContainer = document.createElement('div');
		dateContainer.innerText = date;
		dateContainer.classList.add('button');
		let cell = document.createElement('div');
		cell.classList.add('cell');
		cell.appendChild(dateContainer);
		row.appendChild(cell);
		if (date == today.getDate()) cell.classList.add('today');
		if (row.children.length == 7) {
			row.classList.add('row')
			rows.push(row);
			row = document.createElement('div');
		}
	}
	for (let date = 1; row.children.length < 7; date++) {
		let dateContainer = document.createElement('div');
		dateContainer.innerText = date;
		dateContainer.classList.add('button');
		let cell = document.createElement('div');
		cell.classList.add('cell');
		cell.classList.add('not-in-month');
		cell.innerText = date;
		row.appendChild(cell);
		if (row.children.length == 7) {
			row.classList.add('row')
			rows.push(row);
		}
	}
	return rows;
}
export default {
	mounted() {
		let rows = createCalendar(3, 2024);
		for(let row of rows) this.$refs.calendarContainer.appendChild(row);

		Subscription.subscribe("next-month", (args) => {
			for (let row of rows) row.remove();
			rows = createCalendar(args[1].getMonth()+1, args[1].getFullYear());
			for(let row of rows) this.$refs.calendarContainer.appendChild(row);
		});

		Subscription.subscribe("prev-month", (args) => {
			for (let row of rows) row.remove();
			rows = createCalendar(args[1].getMonth()+1, args[1].getFullYear());
			for(let row of rows) this.$refs.calendarContainer.appendChild(row);
		})
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
	justify-content: center;
	border-right:1px;
	border-top:0px;
	border-left:0px;
	border-bottom: 0px;
	border-style:solid;
	border-color: #dee2e6;
	box-sizing: border-box;
}
.cell > div {
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
