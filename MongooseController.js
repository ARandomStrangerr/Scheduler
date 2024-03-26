import Mongoose from 'mongoose';

const scheduleShematic = new Mongoose.Schema({
	title: {type: String, required: true},
	priority: {
		type: String,
		enum:['Low Priority', 'Medium Priority', 'High Priority'],
		require: true
	},
	startDate:{
		type: Date,
		require: true
	},
	endDate:{
		type: Date,
		require: true
	},
	task:{
		type: [String]
	}
});
const schedule = Mongoose.model('Schedule', scheduleShematic);

function connect(hostName, port, database){
	Mongoose.connect(`mongodb://${hostName}:${port}/${database}`);
}

async function createSchedule(title, priority, startDate, endDate, tasks) {
	let newSchedule = new schedule({
		title: title,
		priority: priority,
		startDate: startDate,
		endDate: endDate,
		task: tasks
	});
	await newSchedule.save();
}

async function getSchedule() {
	return await schedule.find().select('_id title priority');
}

export {createSchedule, getSchedule, connect};
