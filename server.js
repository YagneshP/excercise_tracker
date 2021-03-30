const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const moment = require("moment");


app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//mongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((error) => console.log(error));
mongoose.set("returnOriginal", false);
// Routes
//Home Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
// POST register/create new User
app.post("/api/exercise/new-user", async (req, res) => {
  try {
    //check the user if it is exist already
    let foundUser = await User.findOne({ username: req.body.username });
    //if yes return with the message or error
    if (foundUser) {
      res.json({ message: "User already exist" });
    }
    //if no create user and return the user object
    else {
      let newUser = await User.create({ username: req.body.username });
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

//GET getting all users
app.get("/api/exercise/users", async (req, res) => {
  try {
    let foundUsers = await User.find().select("-log").lean();
    res.status(200).json(foundUsers);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//POST add exercise
app.post("/api/exercise/add", async (req, res) => {
  try {
    const { userId, description, date, duration } = req.body;
		let newExercise = {
			userId,
			description,
			date: date ? moment(date) : moment(),
			duration:+duration,
		}
    let updatedUser = await User.findByIdAndUpdate(userId, {
      $push: {
        log: newExercise,
      },
    }).select("-__v ").lean()
		
    if (updatedUser) {
			// updatedUser.find(where("log").elemMatch(function(elem){
			// 	elem.where({description:`${description}`});
			// }))
			updatedUser = {...updatedUser,log:updatedUser.log.filter(log => moment(newExercise.date).isSame(log.date)? log : null)[0]};
			delete updatedUser.log._id
			updatedUser={...updatedUser,...updatedUser.log}
			delete updatedUser.log
			return res.status(200).json(updatedUser);
    } else {
      throw Error("User not found");
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
});

//GET full exercise log of user
app.get("/api/exercise/log", async (req, res) => {
  // from to date in yyyy-mm-dd format and limit
  try {
		let from 
		let to 
		let limit 
    req.query.from ? from = moment(req.query.from).toDate() : from;
   	req.query.to ?to = moment(req.query.to).toDate() : to;
		req.query.limit ? limit = +req.query.limit:null
    let foundUser = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.query.userId) } },
      {
        $addFields: {
          log: {
            $filter: {
              input: "$log",
              cond: {
                $and: [
                  {$cond:{if:from,then:{$gte: ["$$this.date", from]},else:true} },
                  {$cond:{if:to,then:{$lte: ["$$this.date", to]},else:true} },
                ],
              },
            },
          },
          count: {
            $size: {
              $filter: {
                input: "$log",
                as: "item",
                cond: {
                  $and: [
											{$cond:{if:from,then:{$gte: ["$$item.date", from]},else:true} },
											{$cond:{if:to,then:{$lte: ["$$item.date", to]},else:true} },
										],  
                },
              },
            },
          },
        },
      },
			{
				$project:{
					_id:1,
					username:1,
					from:{$cond:{if:req.query.from,then:moment(from).format("ddd MMM D YYYY"),else:'$$REMOVE'}},
					to:{$cond:{if:req.query.to ,then:moment(to).format("ddd MMM D YYYY"),else:'$$REMOVE'}},
					log:{$cond:{if:req.query.limit,then:{$slice:["$log",limit]},else:'$log'}},
					count:{$size:{$cond:{if:req.query.limit,then:{$slice:["$log",limit]},else:'$log'}}}
				}
			}
    ]);

    if (foundUser.length > 0) {
			foundUser = {...foundUser[0],log:foundUser[0].log.map(log => {return {...log,date:moment(log.date).format("ddd MMM D YYYY")}})}
      res.json(foundUser);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
