const mongoose = require("mongoose");
// const problemSchema = require("../models/problem");
// let Problem = require("../index");

const connectDb2 = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    mongoose.db2 = await mongoose.createConnection(String(process.env.MONGO_URI_2));

    console.log(`Mongo DB connected: ${mongoose.db2.client.options.srvHost}`);
    // console.log(mongoose.db2.client.options.srvHost);
    // console.log(mongoose.connections);

    // module.exports = Problem;
    // console.log("con2");
    // console.log(db2.base.connections);

    // Problem = db2.model('Problem', problemSchema);
    

    // return db2;

  } catch (error) {
    console.log(
      `Unable to connect with Mongo DB: ${error.message}`.cyan.underline
    );
    process.exit(1);
  }
};

module.exports = connectDb2
