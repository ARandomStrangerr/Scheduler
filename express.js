import express from 'express';
import cors from 'cors';
import {getSchedule, createSchedule, connect} from "./MongooseController.js"

// constants
const app = express();
const PORT = 5174;

//middlewares
app.use(cors());
app.use(express.json());

// routes
app.get('/', getCalendar)
app.post('/create', createTaskFunction);

// start listening
app.listen(PORT, listenFcn)

let recentCreateSchedule;

async function getCalendar (request, response) {
	response.status(200).send(await getSchedule());
}

function createTaskFunction (request, response){
	if (!request.body.name || request.body.name.trim() === ""){
		response.status(400).send("Missing task name");
		return;
	} else if (!request.body.priority || request.body.priority === ""){
		response.status(400).send("Missing priority");
		return;
	} else if (!request.body.startDate || request.body.startDate === ""){
		response.status(400).send("Missing start date");
		return;
	} else if (!request.body.endDate || request.body.endDate === "") {
		response.status(400).send("Missing end date");
		return;
	}
	createSchedule(request.body.name, request.body.priority, request.body.startDate, request.body.enDate, request.body.tasks);
	response.status(200).send("Success create task");
}

function listenFcn() {
	connect('localhost', 27017, 'ScheduleDatabase')
	console.log(`listening at port ${PORT}`);
}
