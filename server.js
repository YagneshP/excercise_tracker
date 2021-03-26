const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded());
//mongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,useUnifiedTopology: true}).
  catch(error => console.log(error));
// Routes
//Home Page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
// POST register/create new User 
app.post("/api/excersice/new-user",(req,res)=>{
	res.send("New User route")
});

//GET getting all users
app.get("/api/excercise/users", (req,res)=>{
	res.send("Send array with objects containing username and _id property")
});

//POST add excercise
app.post("/api/excercise/add",(req,res)=>{
	res.send("User object with excercise field")
})

//GET full excercise log of user 
app.get("/api/excercise/log/:user_id",(req,res)=>{   // from to date in yyyy-mm-dd format and limit
	res.send("User with log array with description duration and date also a count property")
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
