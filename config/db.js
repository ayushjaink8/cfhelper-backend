const mongoose = require("mongoose");

const connectDb = async () => {
  try {

    const db1 = await mongoose.connect(String(process.env.MONGO_URI));

    console.log(`Mongo DB connected: ${db1.connection.host}`);

  } catch (error) {
    console.log(
      `Unable to connect with Mongo DB: ${error.message}`.cyan.underline
    );
    process.exit(1);
  }
};

module.exports = connectDb
