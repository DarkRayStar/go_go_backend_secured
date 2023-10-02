const router = require("express").Router();
const { User } = require("../../models/userManagement-models/user");
const Token = require("../../models/userManagement-models/token");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");


//Sending password reset link to given email address
router.post("/", async (req, res) => {
	try {
		//validate email field
		const emailSchema = Joi.object({
			email: Joi.string().email().required().label("Email"), //its a string , email and required 
		});
		//check if error occurred or not
		const { error } = emailSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		//check entered email is a registered or not
		let user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res
				.status(409)
				.send({ message: "User with given email does not exist!" });
		}

		//fine token with user ID
		let token = await Token.findOne({ userId: user._id });
		//if token will doesn't exist create new token
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		//creating a URL
		const url = `${process.env.BASE_URL}user-password-reset/${user._id}/${token.token}/`;
		//send email
		await sendEmail(user.email, "Password Reset", url);

		//if email send successfully display success message 
		res.status(200).send({ message: "Password reset link sent to your email account" });

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});



// verify password reset link sending in email
router.get("/:id/:token", async (req, res) => {
	try {
		//after click on url check user doesn't exist or not using user ID
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		//check token is doesn't exist or not
		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		//if passing using ID and token is valid display success message
		res.status(200).send({message: "Valid Url"});

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});



//Reset new password
router.post("/:id/:token", async (req, res) => {
	try {
		//validate the password using passwordComplexity and required the password field
		const passwordSchema = Joi.object({
			password: passwordComplexity().required().label("Password"),
		});
		//check it validate or not
		const { error } = passwordSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		//check url is valid or not (using user ID and token)
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		//check user already verify this email or not
		//if not then passing true
		if (!user.verified) user.verified = true;

		//user entered password converted in to hash password
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		//after user enter and click on submit
		user.password = hashPassword;
		// save the password
		await user.save();
		// token will remove 
		await token.remove();

		//if password reset success display success message
		res.status(200).send({ message: "Password reset successfully" });

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;

