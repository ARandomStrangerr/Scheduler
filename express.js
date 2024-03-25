import express from 'express';
import cors from 'cors';

// constants
const app = express();
const PORT = 5174;

//middlewares
app.use(cors());
app.use(express.json());

// routes
app.post('/create', createTaskFunction);

// start listening
app.listen(PORT, listenFcn)

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
}

function listenFcn() {
	console.log(`listening at port ${PORT}`);
}
