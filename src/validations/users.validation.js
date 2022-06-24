const { check } = require("express-validator");
const editUsersValidation = [
	// name
	check("name", "name cannot be empty").not().isEmpty(),
	check("name", "name only letter allowed").matches(/^[A-Za-z ]+$/),
	check("name", "name must be between 3 and 50 characters").isLength({
		min: 3,
		max: 50,
	}),

	// email
	check("email", "Email required").not().isEmpty(),
	check("email", "please enter email correctly").isEmail(),
	check("email", "Email maximum length is 50 characters").isLength({ max: 50 }),

	// phone
	check("phone", "Phone Number required").not().isEmpty(),
	check("phone", "Please Enter phone Number correctly").isMobilePhone(),
];
const modeChangeValidation = [
	// isActive
	check("isActive", "isActive cannot be empty").not().isEmpty(),
	check("isActive", "isActive value must be between 0 to 1").isInt({
		min: 0,
		max: 1,
	}),
];

const modifyPassValidation = [
	// newpass
	check("newPass", "new password required").not().isEmpty(),
	check("newPass", "new password require 8 or more characters").isLength({
		min: 8,
	}),
	check(
		"newPass",
		"new password must include one lowercase character, one uppercase character, a number, and a special character."
	).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),

	// confirmpass
	check("confirmNewPass", "confirm new password required").not().isEmpty(),
	check(
		"confirmNewPass",
		"confirm new password require 8 or more characters"
	).isLength({
		min: 8,
	}),
	check(
		"confirmNewPass",
		"confirm new password must include one lowercase character, one uppercase character, a number, and a special character."
	).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
];

module.exports = {
	editUsersValidation,
	modeChangeValidation,
	modifyPassValidation,
};
