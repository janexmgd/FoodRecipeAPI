const recipeModel = require("../models/recipe.model");
const commentModel = require("../models/comment.model");
const { failed } = require("../helpers/response");

module.exports = {
	isAdmin: (req, res, next) => {
		if (req.APP_DATA.tokenDecoded.level === 0) {
			next();
		} else {
			failed(res, null, "failed", "user dont have access");
		}
	},
	isCustomer: (req, res, next) => {
		if (req.APP_DATA.tokenDecoded.level === 1) {
			next();
		} else {
			failed(res, null, "failed", "user dont have access");
		}
	},
	isOwnedUser: (req, res, next) => {
		if (req.APP_DATA.tokenDecoded.id === req.params.id) {
			next();
		} else {
			failed(res, null, "failed", "its not your id");
		}
	},
	isOwnedRecipe: async (req, res, next) => {
		const id = req.params.id;
		const recipe = await recipeModel.getRecipeUsersId(id);
		if (recipe.rowCount == 0) {
			failed(res, null, "failed", "recipe not found");
			return;
		}
		const { users_id } = recipe.rows[0];
		if (req.APP_DATA.tokenDecoded.id === users_id) {
			next();
		} else {
			failed(res, null, "failed", "its not your recipe");
		}
	},
	isOwnedComment: async (req, res, next) => {
		const id = req.params.id;
		const comment = await commentModel.commentDetailData(id);
		if (comment.rowCount == 0) {
			failed(res, null, "failed", "comment not found");
			return;
		}
		const { users_id } = comment.rows[0];
		if (req.APP_DATA.tokenDecoded.id === users_id) {
			next();
		} else {
			failed(res, null, "failed", "its not your comment");
		}
	},
};
