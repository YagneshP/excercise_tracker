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
    let foundUsers = await User.find();
    res.status(200).json(foundUsers);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//POST add exercise
app.post("/api/exercise/add", async (req, res) => {
  try {
    const { userId, description, date, duration } = req.body;
    let foundUser = await User.findByIdAndUpdate(userId, {
      $push: {
        log: {
          userId,
          description,
          date: date ? moment(date) : moment(),
          duration,
        },
      },
    });
    if (foundUser) {
      return res.status(200).json(foundUser);
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
    let from = moment(req.query.from).toDate();
    let to = moment(req.query.to).toDate();
    let foundUser = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.query.userId) } },
      {
        $addFields: {
          log: {
            $filter: {
              input: "$log",
              cond: {
                $and: [
                  { $gte: ["$$this.date", from] },
                  { $lte: ["$$this.date", to] },
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
                    { $gte: ["$$item.date", from] },
                    { $lte: ["$$item.date", to] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          from: { $first: from },
          to: { $first: to },
          log: { $first: "$log" },
          count: { $first: "$count" },
        },
      },
    ]);

    if (foundUser.length > 0) {
      res.json(foundUser[0]);
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
