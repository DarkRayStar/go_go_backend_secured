const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Generate token for students
//It generate token using student ID
const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user", //Reference will be a user model
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 3600 }, //token will expired after the 1 hour
});

module.exports = mongoose.model("token", tokenSchema);