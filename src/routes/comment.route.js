const express = require("express");

const {
	commentAll,
	commentDetail,
	commentInsert,
	commentEdit,
	commentDelete,
	commentByRecipe,
} = require("../controllers/comment.controller");

const jwtAuth = require("../middleware/jwtAuth");
const {
	isCustomer,
	isAdmin,
	isOwnedComment,
} = require("../middleware/authorization");
const validation = require("../middleware/validation");
const {
	addCommentValidation,
	editCommentValidation,
} = require("../validations/comment.validation");

const commentRouter = express.Router();

commentRouter
	.get("/comment", jwtAuth, commentAll)
	.get("/comment/:id", jwtAuth, commentDetail)
	.post(
		"/comment",
		jwtAuth,
		isCustomer,
		addCommentValidation,
		validation,
		commentInsert
	)
	.put(
		"/comment/:id",
		jwtAuth,
		isOwnedComment,
		editCommentValidation,
		validation,
		commentEdit
	)
	.delete("/comment/:id", jwtAuth, isOwnedComment, commentDelete)
	.get("/comment/recipe/:recipeId", jwtAuth, isAdmin, commentByRecipe);

module.exports = commentRouter;
