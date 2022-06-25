const { check } = require("express-validator");

const addRecipeValidation = [
	// title
	check("title", "title cannot be empty").not().isEmpty(),
	check("title", "title only letter allowed").matches(/^[A-Za-z ]+$/),
	check("title", "title must be between 3 and 50 characters").isLength({
		min: 3,
		max: 50,
	}),

	// ingredients
	check("ingredients", "ingredients required").not().isEmpty(),

	// video
	check("video", "video cannot be empty").not().isEmpty(),
];

const updateRecipeValidation = [
	// title
	check("title", "title cannot be empty").not().isEmpty(),
	check("title", "title only letter allowed").matches(/^[A-Za-z ]+$/),
	check("title", "title must be between 3 and 50 characters").isLength({
		min: 3,
		max: 50,
	}),

	// ingredients
	check("ingredients", "ingredients required").not().isEmpty(),

	// video
	check("video", "video cannot be empty").not().isEmpty(),
];
const modeChangeValidation = [
	// isActive
	check("isActive", "isActive cannot be empty").not().isEmpty(),
	check("isActive", "isActive value must be between 0 to 1").isInt({
		min: 0,
		max: 1,
	}),
];

module.exports = {
	addRecipeValidation,
	updateRecipeValidation,
	modeChangeValidation,
};
