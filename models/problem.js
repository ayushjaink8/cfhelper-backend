const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
	contestId: String,
	index: String,
	name: String,
	tags: [String],
	rating: Number,
	frequency: Number,
});


module.exports = problemSchema;
