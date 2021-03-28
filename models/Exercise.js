const mongoose = require("mongoose")
// const User = require("./User")
const exerciseSchema = new mongoose.Schema({
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

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;