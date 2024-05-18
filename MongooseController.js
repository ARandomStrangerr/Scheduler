import Mongoose from 'mongoose';

const scheduleShematic = new Mongoose.Schema({
	scheduleName: {type: String, required: true},
	priority: {type: String, enum:['Low Priority', 'Medium Priority', 'High Priority'], require: true},
	tasks:{
		type: [{type: Mongoose.Types.ObjectId, ref: 'Task'}],
		require: false
	}
});
/**
why anti-normalization? normalization is introduced to reduce the complication during update.
the behaviour of this application highly based on read, write, not much of update.
the update relates to schema id never happes.
when a schema is deleted, all its task is going to be deleted
when a schema is updated, its id does not change
so pretty much, schema id never changes.
*/
const taskSchema = new Mongoose.Schema({
	parent: {type: Mongoose.Types.ObjectId, ref: 'Schedule'}, // refer to the id of the schedule schema
	type: {type: String, require: true, enum: ['schedule', 'deadline']}, // task type
	taskName: {type: String, require: true}, // name of the task
	startTimeFirstOccurence: {type : Date, require: false}, // start time of the first occurance of the task
	endTimeFirstOccurence: {type: Date, require: false}, // end time of the first occurance of the task
	lastOccurence: {type: Date, require: true}, // date of the last occurance of the task
	repeatPattern: {type: [{type: Number}], require: false}, // pattern to repeat
	note: {type:String, require: false}, // note for the task
	complete: {type: Boolean, require: true, default: false} // mark that the task is completed or not
});
const scheduleModel = Mongoose.model('Schedule', scheduleShematic);
const taskModel = Mongoose.model('Task', taskSchema);

/* connect to the mongodb */
function connect(hostName, port, database){
	Mongoose.connect(`mongodb://${hostName}:${port}/${database}`);
}

/* create a new schedule */
async function createSchedule(schedule) {
	let newSchedule = new scheduleModel({
		scheduleName: schedule.scheduleName,
		priority: schedule.priority,
		tasks: []
	});
	for (let task of schedule.tasks){
		let newTask = new taskModel(task);
		newTask.parent = newSchedule._id;
		if(!task.lastOccurence) newTask.lastOccurence = schedule.endTimeFirstOccurance;
		newSchedule.tasks.push(newTask._id);
		newTask.save();
	}
	newSchedule.save();
}

/* get list of schedules to display on the left */
async function getSchedules() {
	return await scheduleModel.find().select('_id scheduleName priority');
}

/* get a specific schedule with all its details based on the id */
async function getScheduleById(id){
	return await scheduleModel.findById(id).populate('tasks');
}

/* delete a specific schedule based on the given id */
async function deleteSchedule(id){
	let deleteItem = await scheduleModel.findById(id)
	for (let taskId of deleteItem.tasks) taskModel.findByIdAndDelete(taskId).exec();
	scheduleModel.findByIdAndDelete(id).exec();
}

/* update a specific schedule with all its tasks */
async function updateScheduleById(schedule){
	console.log(schedule);
	let updateSchedule = new scheduleModel({
		scheduleName: schedule.scheduleName,
		priority: schedule.priority,
		tasks:[]
	});
	for (let task of schedule.tasks) {
		if (task._id){
			taskModel.findByIdAndUpdate(task._id, task, {new: true}).exec();
			updateSchedule.tasks.push(task._id);
		} else {
			let newTask = new taskModel(task);
			newTask.parent = schedule._id;
			updateSchedule.push(newTask._id);
			newTask.save();
		}
	}
	// scheduleModel.findByIdAndUpdate(schedule._id, updateSchedule, {new:true}).exec();
}

// get a list of task to display
async function getTaskByDateRange(startDate, endDate){
	/*
	a = start search date
	b = end search date
	c = first occurance of the task
	d = last occurance of the task
	now we can think the problem as permutation of letters
	initial intuitive suggest that there are 4! = 24 ways to arrage those letters
	however, a < b and c <= d, now we have pairs (a,b) and (c,d)
	for (a,b), there are 4 positions, we do care about its order -> 4! total way to picks, divides by 2! blank position, divide by 1! way to order
	for (c,d), we have only 2 spaces for 2 elemens, 1!/1! = 1 ways
	therefore there are 4C2=6 ways to choose ways to choose
	abcd - task beyond view range - does not care
	acbd - task start within month then extends beyond view range
	cabd - task start before month then extends beyond view range
	cadb - task start before month then end in view range
	acdb - task start and end within view range
	cdab - task before view range - does not care
	essentially, we look for something (start within the view range) or (end within the view range) or (start before view range and end after view range).
	*/
	let queryClause = {
		$or: [
			{endTimeFirstOccurence: {$gte: startDate, $lte: endDate}}, // start within the view range
			{lastOccurence: {$gte: startDate, $lte: endDate}}, // end within the view range
			{
				$and: [
					{endTimeFirstOccurence: {$lt: startDate}},
					{lastOccurence: {$gt: endDate}}
				]
			} // start before and end after the view range
		]
	};
	let result = await taskModel.find(queryClause).populate("parent");
	return result;
}

export {createSchedule, getSchedules, getScheduleById, getTaskByDateRange, deleteSchedule, updateScheduleById, connect};
