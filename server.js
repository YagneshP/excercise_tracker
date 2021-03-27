const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
const User = require("./models/user")
const Excercise = require("./models/excercise")

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//mongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,useUnifiedTopology: true}).
  catch(error => console.log(error));
// Routes
//Home Page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
// POST register/create new User 
app.post("/api/exercise/new-user",async(req,res)=>{
	try{
		//check the user if it is exist already
		let foundUser = await User.findOne({username:req.body.username})
		//if yes return with the message or error
		if(foundUser){
			res.json({message:"User already exist"})
		}
		 //if no create user and return the user object
		else{   
			let newUser = await User.create({username:req.body.username})
			res.status(201).json(newUser);
		} 		
	} catch(error){
		res.json({error: error.message})
	}
});

//GET getting all users
app.get("/api/exercise/users", (req,res)=>{
	res.send("Send array with objects containing username and _id property")
});

//POST add exercise
app.post("/api/exercise/add",(req,res)=>{
	res.send("User object with exercise field")
})

//GET full exercise log of user 
app.get("/api/exercise/log/:user_id",(req,res)=>{   // from to date in yyyy-mm-dd format and limit
	res.send("User with log array with description duration and date also a count property")
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
