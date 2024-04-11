import Mongoose from 'mongoose';

// todo: improve on this design, the collection should be split into 2 collections for faster retreaval time of schedules and tasks
const scheduleShematic = new Mongoose.Schema({
	title: {type: String, required: true},
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
	parent: {type: Mongoose.Types.ObjectId, ref: 'Schedule'},
	type: {type: String, requre: true, enum: ['schedule', 'deadline']},
	task: {type: String, require: true},
	start: {type: Date, require: false},
	end: {type: Date, require: true},
	note: {type: String, require: false},
	complete: {type: Boolean, require: true, default: false}
});
const scheduleModel = Mongoose.model('Schedule', scheduleShematic);
const taskModel = Mongoose.model('Task', taskSchema);

function connect(hostName, port, database){
	Mongoose.connect(`mongodb://${hostName}:${port}/${database}`);
}

async function createSchedule(title, priority, tasks) {
	let newSchedule = new scheduleModel({
		title: title,
		priority: priority
	});
	let taskList = [];
	for (let task of tasks) {
		let savedTask = new taskModel({
			parent: newSchedule._id,
			type: task.type,
			task: task.task,
			start: task.start,
			end: task.end,
			note: task.note,
			complete: task.complete
		});
		await savedTask.save();
		taskList.push(savedTask._id);
	}
	newSchedule.tasks = taskList;
	await newSchedule.save();
}

async function getSchedule() {
	return await scheduleModel.find().select('_id title priority');
}

async function getScheduleById(id){
	return await scheduleModel.findById(id).populate('tasks');
}

async function deleteSchedule(id){
	let deleteItem = await scheduleModel.findById(id)
	for (let taskId of deleteItem.tasks) taskModel.findByIdAndDelete(taskId).exec();
	scheduleModel.findByIdAndDelete(id).exec();
}

async function updateScheduleById(id, title, priority, tasks){
	let newSchedule = {
		title: title,
		priority: priority
	};
	let taskList = [];
	for (let task of tasks) {
		if (task._id){
			taskModel.findByIdAndUpdate(task._id, task, {new: true}).exec();
			taskList.push(task._id);
		} else {
			let temp = new taskModel(task);
			temp.parent = id
			temp.save();
			taskList.push(temp._id);
		}
	}

	scheduleModel.findByIdAndUpdate(id, newSchedule, {new:true}).exec();
}

async function getTaskByDate(startDate, endDate){
	return await taskModel.find({end:{$gte:startDate, $lte:endDate}}).populate('parent');
}

export {createSchedule, getSchedule, getScheduleById, getTaskByDate, deleteSchedule, updateScheduleById, connect};
