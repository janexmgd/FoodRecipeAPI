const { check } = require("express-validator");

const addCommentValidation = [
	// recipeId
	check("recipeId", "recipe id cannot be empty").not().isEmpty(),

	// commentText
	check("commentText", "comment text is required").not().isEmpty(),
];
const editCommentValidation = [
	// commentText
	check("commentText", "comment text is required").not().isEmpty(),
];

module.exports = {
	addCommentValidation,
	editCommentValidation,
};
