const router = require("express").Router();
const { User, validate } = require("../../models/userManagement-models/user");
const bcrypt = require("bcrypt");

// insert data
router.post("/registration", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User Registration successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


// get all users details
router.route('/get-all').get((req, res) => {
	User.find()
		.then(userDetails => res.json(userDetails))
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get-user-by-id/:id').get((req, res) => {
	User.find({ _id: req.params.id })
		.then(items => res.json(items))
		.catch(err => res.status(400).json('Error: ' + err));
});

// get user details by id
router.route('/:id').get((req, res) => {
	User.findById(req.params.id)
		.then(userDetails => res.json(userDetails))
		.catch(err => res.status(400).json('Error: ' + err));
});

//delete Account
router.route('/:id').delete((req, res) => {
	User.findByIdAndDelete(req.params.id)
		.then(() => res.json('User Account deleted.'))
		.catch(err => res.status(400).json('Error: ' + err));
});

//update User details
router.route('/update-profile/:id').post((req, res) => {
	User.findById(req.params.id)
		.then(userDetails => {

			userDetails.firstName = req.body.firstName;
			userDetails.lastName = req.body.lastName;
			userDetails.mobileNumber = req.body.mobileNumber;
			userDetails.phoneNumber = req.body.phoneNumber;
			userDetails.address = req.body.address;
			userDetails.zipCode = req.body.zipCode;
			userDetails.district = req.body.district;
			userDetails.image = req.body.image;
			userDetails.userRole = req.body.userRole;
			

			userDetails.save()
				.then(() => res.json('User Profile Successfully updated'))
				.catch(err => res.status(400).json('Error: ' + err));
		})
		.catch(err => res.status(400).json('Error: ' + err));
});

//search Date Rage
router.post("/search", async (req, res) => {
	try {
		User
			.find({
				registeredDate: {
					$gte: new Date(req.body.fromDate),
					$lt: new Date(req.body.toDate),
				},
			})
			.then((result) => {
				// console.log(result);
				res.json(result);
			});
	} catch (error) {
		// console.log(error);
		res.status(500).send({ message: error });
	}
});

module.exports = router;
