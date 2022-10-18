const mongoose = require("mongoose");
// const contestSchema = require("../models/contestModel");
// const tempUserSchema = require("../models/tempUserModel");
// const userSchema = require("../models/userModel");

// let Contest = require("../index.js")
// let TempUser = require("../index")
// let User = require("../index")



const connectDb = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    const db1 = await mongoose.connect(String(process.env.MONGO_URI));

    console.log(`Mongo DB connected: ${db1.connection.host}`);
    // console.log(mongoose.db1.client.options.srvHost);
    // console.log(mongoose.db1);
    // console.log("con1");
    // // console.log(db1);
    // // console.log(db1.connections);

    // Contest = db1.model("Contest", contestSchema);
    // TempUser = db1.model("TempUser", tempUserSchema);
    // User = db1.model("User", userSchema);

    // module.exports = Contest;
    // module.exports = TempUser;
    // module.exports = User;

  } catch (error) {
    console.log(
      `Unable to connect with Mongo DB: ${error.message}`.cyan.underline
    );
    process.exit(1);
  }
};

module.exports = connectDb
