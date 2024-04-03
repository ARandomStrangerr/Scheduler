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
app.get('/', getSchedules);
app.post('/create', createSchedule);
app.get('/:id', getSchedule);
app.delete('/:id', deleteSchedule);
app.put('/:id', updateSchedule);
app.get('*', (req, res) => res.status(404));

// start listening
app.listen(PORT, listenFcn)

async function getSchedules (request, response) {
	response.status(200).send(await MongooseFunctions.getSchedule());
}

async function getSchedule (request, response) {
	let responseData = await MongooseFunctions.getScheduleById(request.params.id);
	response.status(200).send(responseData);
}

function createSchedule (request, response){
	if (!request.body.title || request.body.title.trim() === ""){
		response.status(400).send("Missing task name");
		return;
	} else if (!request.body.priority || request.body.priority === ""){
		response.status(400).send("Missing priority");
		return;
	}
	// for (let index in request.body.tasks){
	// 	if (body.tasks[index]))
	// }
	MongooseFunctions.createSchedule(request.body.title, request.body.priority, request.body.tasks);
	response.status(200).send("Success create schedule");
}

async function deleteSchedule (request, response) {
	await MongooseFunctions.deleteSchedule(request.params.id);
	response.status(200).send("Success delete schedule");
}

async function updateSchedule (request, response) {
	await MongooseFunctions.updateScheduleById(request.body.id, request.body.title, request.body.priority, request.body.startDate, request.body.endDate, request.body.tasks)
	response.status(200).send("Success update schedule");
}

function listenFcn() {
	MongooseFunctions.connect('localhost', 27017, 'ScheduleDatabase')
	console.log(`listening at port ${PORT}`);
}
