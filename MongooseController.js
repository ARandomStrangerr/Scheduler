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
	let updateSchedule = new scheduleModel({
		title: schedule.title,
		priority: schedule.priority,
		tasks:[]
	});
	for (let task of schedule.tasks) {
		if (task._id){
			taskModel.findByIdAndUpdate(task._id, task, {new: true}).exec();
			updateSchedule.tasks.push(task._id);
		} else {
			let newTask = new taskModel(task);
			newTask.parent = id;
			updateSchedule.push(newTask._id);
			newTask.save();
		}
	}
	scheduleModel.findByIdAndUpdate(schedule._id, updateSchedule, {new:true}).exec();
}

async function getTaskByDate(startDate, endDate){
	return await taskModel.find({end:{$gte:startDate, $lte:endDate}}).populate('parent');
}

export {createSchedule, getSchedules, getScheduleById, getTaskByDate, deleteSchedule, updateScheduleById, connect};
