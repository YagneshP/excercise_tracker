const mongoose = require("mongoose");
// const Excercise = require("./excercise");
const excerciseSchema = new mongoose.Schema({
	// userId:{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref:"User"
	// },
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
		//  default:Date.now,
		// required:true
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