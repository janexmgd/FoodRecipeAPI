const recipeModel = require("../models/recipe.model");
const commentModel = require("../models/comment.model");
const { failed } = require("../helpers/response");

module.exports = {
	isAdmin: (req, res, next) => {
		if (req.APP_DATA.tokenDecoded.level === 0) {
			next();
		} else {
			failed(res, {
				code: 500,
				status: "failed",
				message: "user dont have access",
				error: [],
			});
		}
	},
	isCustomer: (req, res, next) => {
		if (req.APP_DATA.tokenDecoded.level === 1) {
			next();
		} else {
			failed(res, {
				code: 500,
				status: "failed",
				message: "user dont have access",
				error: [],
			});
		}
	},
	isOwnedUser: (req, res, next) => {
		if (req.APP_DATA.tokenDecoded.id === req.params.id) {
			next();
		} else {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Its not your user",
				error: [],
			});
		}
	},
	isOwnedRecipe: async (req, res, next) => {
		const id = req.params.id;
		const recipe = await recipeModel.getRecipeUsersId(id);
		if (recipe.rowCount == 0) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Recipe not found",
				error: [],
			});
			return;
		}
		const { users_id } = recipe.rows[0];
		if (req.APP_DATA.tokenDecoded.id === users_id) {
			next();
		} else {
			failed(res, {
				code: 500,
				status: "failed",
				message: "its not ur recipe",
				error: [],
			});
		}
	},
	isOwnedComment: async (req, res, next) => {
		const id = req.params.id;
		const comment = await commentModel.commentDetailData(id);
		if (comment.rowCount == 0) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Comment not found",
				error: [],
			});
			return;
		}
		const { users_id } = comment.rows[0];
		if (req.APP_DATA.tokenDecoded.id === users_id) {
			next();
		} else {
			failed(res, {
				code: 500,
				status: "failed",
				message: "its not your comment",
				error: [],
			});
		}
	},
};
