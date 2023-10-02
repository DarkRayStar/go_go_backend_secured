const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    zipCode: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	image: { type: String, required: true },
	registeredDate: { type: Date, required: true}

});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

let registeredDate 



const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		mobileNumber: Joi.string().required().label("Mobile Number"),
		phoneNumber: Joi.string().required().label("Phone Number"),
		email: Joi.string().email().required().label("Email"),
		address: Joi.string().required().label("Address"),
		zipCode: Joi.string().required().label("Postal/ Zip Code"),
		district: Joi.string().required().label("District"),
		password: passwordComplexity().required().label("Password"),
		image: Joi.string().required().label("Image URL"),
		registeredDate: Joi.date().required().label("Registered Date")
	});
	return schema.validate(data);
};

module.exports = { User, validate };
