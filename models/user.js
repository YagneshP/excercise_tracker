const mongoose = require("mongoose");
const excerciseSchema = new mongoose.Schema({

	description:{
		type: String,
		required:true
	},
	duration:{
		type:Number,
		required:true
	},
	date:{
		type:Date
	}
});

const userSchema = new mongoose.Schema({
	username:{
		type:String,
		required:true
	},
	log:[excerciseSchema]
});

const user = mongoose.model("User", userSchema);

module.exports = user;