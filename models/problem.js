const mongoose = require('mongoose');
// const db1 = require("../index");

const problemSchema = mongoose.Schema({
	contestId: String,
	index: String,
	name: String,
	tags: [String],
	rating: Number,
	frequency: Number,
});

const Problem = mongoose.model('Problem', problemSchema);

// module.exports = problemSchema;
module.exports = Problem;
