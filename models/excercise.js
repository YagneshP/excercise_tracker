const mongoose = require("mongoose")
const User = require("./user")
const excerciseSchema = new mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	description:{
		type: String,
		required
	},
	duration:{
		type:Number,
		required
	},
	date:{
		type:Date,
		default: Date.now
	}
});

const excercise = mongoose.model("Excercise", excerciseSchema);

module.exports = excercise;