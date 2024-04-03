import Mongoose from 'mongoose';

const scheduleShematic = new Mongoose.Schema({
	title: {type: String, required: true},
	priority: {
		type: String,
		enum:['Low Priority', 'Medium Priority', 'High Priority'],
		require: true
	},
	tasks:{
		type: [
			{
				task: {type: String, require: true},
				deadline: {type: Date, require: true},
				note: {type: String, require: false},
				complete: {type: Boolean, require: true, default: false}
			}
		],
		require: false
	}
});
const schedule = Mongoose.model('Schedule', scheduleShematic);

function connect(hostName, port, database){
	Mongoose.connect(`mongodb://${hostName}:${port}/${database}`);
}

async function createSchedule(title, priority, tasks) {
	let newSchedule = new schedule({
		title: title,
		priority: priority,
		tasks: tasks
	});
	await newSchedule.save();
}

async function getSchedule() {
	return await schedule.find().select('_id title priority');
}

async function getScheduleById(id){
	return await schedule.findById(id);
}

async function deleteSchedule(id){
	await schedule.findByIdAndDelete(id);
}
async function updateScheduleById(id, title, priority, tasks){
	let newSchedule = {
		title: title,
		priority: priority,
		tasks: tasks
	};
	await schedule.findByIdAndUpdate(id, newSchedule, {new:true});
}
export {createSchedule, getSchedule, getScheduleById, deleteSchedule, updateScheduleById, connect};
