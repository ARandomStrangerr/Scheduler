import express from 'express';
import cors from 'cors';
import * as MongooseFunctions from "./MongooseController.js"

// constants
const app = express();
const PORT = 5174;

//middlewares
app.use(cors());
app.use(express.json());

// routes
app.post('/create', createSchedule);
app.get('/get-schedule/:id', getSchedule);
app.get('/get-schedules', getSchedules);
app.delete('/delete-schedule/:id', deleteSchedule);
app.put('/update-schedule/:id', updateSchedule);
app.get('/get-calendar', getCalendar);
app.get('*', (req, res) => res.status(404).send("The requested path does not exists"));

// start listening
app.listen(PORT, listenFcn)

async function getSchedules (request, response) {
	response.status(200).send(await MongooseFunctions.getSchedule());
}

async function getSchedule (request, response) {
	let responseData = await MongooseFunctions.getScheduleById(request.params.id);
	response.status(200).send(responseData);
}

async function getCalendar (request, response) {
	const startDate = new Date(request.query.start);
	const endDate = new Date(request.query.end);
	try{
		response.status(200).send(await MongooseFunctions.getTaskByDate(startDate, endDate));
	} catch {
		response.status(400).send("error");
	}
}

function createSchedule (request, response){
	if (!request.body.title || request.body.title.trim() === ""){
		response.status(400).send("Missing schedule name");
		return;
	} else if (!request.body.priority || request.body.priority === ""){
		response.status(400).send("Missing priority");
		return;
	}
	for (let index in request.body.tasks){
		if (!request.body.tasks[index].task || !request.body.tasks[index].task.trim()){
			response.status(400).send(`Sub-task of index ${index} does not have name`);
			return;
		} else if (!request.body.tasks[index].end) {
			response.status(400).send(`Sub-task of index ${index} does not have deadline`);
			return;
		} else if(new Date() >= new Date(request.body.tasks[index].end)){
			response.status(400).send(`Sub-task of index ${index}, deadline cannot before the current time`);
			return;
		}
	}
	MongooseFunctions.createSchedule(request.body.title, request.body.priority, request.body.tasks);
	response.status(200).send("Success create schedule");
}

async function deleteSchedule (request, response) {
	await MongooseFunctions.deleteSchedule(request.params.id);
	response.status(200).send("Success delete schedule");
}

async function updateSchedule (request, response) {
	await MongooseFunctions.updateScheduleById(request.body._id, request.body.title, request.body.priority, request.body.tasks)
	response.status(200).send("Success update schedule");
}

function listenFcn() {
	MongooseFunctions.connect('localhost', 27017, 'ScheduleDatabase')
	console.log(`listening at port ${PORT}`);
}
