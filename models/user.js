const mongoose = require("mongoose");
const Excercise = require("./excercise");

const userSchema = new mongoose.Schema({
	username:{
		type:String,
		required:true
	},
	log:[{type:mongoose.Schema.Types.ObjectId,ref:"Excercise"}]
});

const user = mongoose.model("User", userSchema);

module.exports = user;