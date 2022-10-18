const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/db");
const mongoose = require("mongoose");

const { createServer } = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require("cors");
const connectDb2 = require("./config/db2");

// const contestSchema = require("./models/contestModel");
// const tempUserSchema = require("./models/tempUserModel");
// const userSchema = require("./models/userModel");
// const problemSchema = require("./models/problem");

// Connect to MonogoDB.
connectDb();
connectDb2();

// const a = async () => {
//   const db1 = await connectDb();
//   // const {db1} = require("./config/db")
//   const Contest = db1.model("Contest", contestSchema);
//   const TempUser = db1.model("TempUser", tempUserSchema);
//   const User = db1.model("User", userSchema);

//   return {
//     Contest: Contest,
//     TempUser: TempUser,
//     User: User
//   }
// }

// // Connect MongoDB-2 for practice ladder data.

// const b = async () => {
//   const db2 = await connectDb2();
//   const Problem = db2.model('Problem', problemSchema);
//   // const {db2} = require("./config/db2")
//   return {
//     Problem: Problem
//   };
// }

// const a1 = a();
// const b1 = b();

// const Contest = a1.Contest;
// const TempUser = a1.TempUser;
// const User = a1.User;
// const Problem = b1.Problem;


// ---------------------------------------------------------------------------------------


// const db1 = mongoose.createConnection(String(process.env.MONGO_URI));
// // console.log(db1);
// const Contest = db1.model("Contest", contestSchema);
// const TempUser = db1.model("TempUser", tempUserSchema);
// const User = db1.model("User", userSchema);

// const db2 = mongoose.createConnection(String(process.env.MONGO_URI_2));
// const Problem = db2.model('Problem', problemSchema);
// console.log(Problem);



// ---------------------------------------------------------------------------

// connectDb();
// connectDb2();
// let Contest;
// let TempUser;
// let User;
// let Problem;



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  // console.log("A user connected!");
  socket.on("joinRoom", (contestId) => {
    // console.log(`Joined ${contestId}`);
    socket.join(contestId);

    socket.on("updateContest", (contestId) => {
      // Broadcast a message that a user has joined.
      // console.log("Emitting a contestUpdated event.");
      socket.broadcast.to(contestId).emit("contestUpdated", contestId);
    });
  });

  socket.on("leaveContest", (contestId) => {
    // console.log(`Left ${contestId}`);
    socket.leave(contestId);
    socket.to(contestId).emit("contestUpdated", contestId);
  });
});

// Add middlewares to parse json requests and url encoded bodies
// of requests.

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All routes of the app.
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contests", require("./routes/contestRoutes"));
app.use("/api/practice", require("./routes/practiceRoutes"));
app.use("/api/analyze", require("./routes/analyzeRoutes"));

// This is a test route.
app.use("/api", require("./routes/testRoutes"));
app.get('/health', (req, res) => {
	res.send('CFHelper Backend working...');
})

// Error middleware
app.use(errorHandler);

httpServer.listen(port, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Socket IO listening on port ${port}`);
  }
});


// module.exports = Contest
// module.exports= TempUser
// module.exports = User
// module.exports = Problem
// module.exports = db1;
// module.exports = db2;
// module.exports = {
//   Contest,
//   TempUser,
//   User,
//   Problem
// }


