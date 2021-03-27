const mongoose = require("mongoose")
const User = require("./user")
const excerciseSchema = new mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	description:{
		type: String,
		required:true
	},
	duration:{
		type:Number,
		required:true
	},
	date:{
		type:Date,
		default: Date.now
	}
});

const excercise = mongoose.model("Excercise", excerciseSchema);

module.exports = excercise;