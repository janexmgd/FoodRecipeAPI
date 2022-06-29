const commentModel = require("../models/comment.model");
const recipeModel = require("../models/recipe.model");
const { success, failed } = require("../helpers/response");
const { v4: uuidv4 } = require("uuid");

const commentController = {
	commentAll: async (req, res) => {
		try {
			const { page, limit } = req.query;
			const pageValue = page ? Number(page) : 1;
			const limitValue = limit ? Number(limit) : 2;
			const offsetValue = (pageValue - 1) * limitValue;
			const alldata = await commentModel.Alldata();
			const totalData = Number(alldata.rows[0].total);
			const data = await commentModel.commentAllData(offsetValue, limitValue);
			const pagination = {
				currentPage: pageValue,
				dataPerPage: limitValue,
				totalPage: Math.ceil(totalData / limitValue),
			};
			success(res, {
				code: 200,
				status: "success",
				message: `Success get comment`,
				data: data.rows,
				pagination: pagination,
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "error",
				message: err.message,
				error: [],
			});
			return;
		}
	},
	commentDetail: async (req, res) => {
		try {
			const id = req.params.id;
			const data = await commentModel.commentDetailData(id);
			if (data.rowCount === 0) {
				const err = {
					message: `Maaf data tidak ditemukan`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			success(res, {
				code: 200,
				status: "success",
				message: `Success get comment with id ${id}`,
				data: data.rows[0],
				pagination: [],
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "error",
				message: err.message,
				error: [],
			});
			return;
		}
	},
	commentInsert: async (req, res) => {
		try {
			const { recipeId, commentText } = req.body;
			const id = uuidv4();
			const findRecipe = await recipeModel.recipeDetailData(recipeId);

			if (findRecipe.rowCount == 0) {
				const err = {
					message: "recipe tidak ditemukan",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			const usersId = req.APP_DATA.tokenDecoded.id;

			const data = {
				id,
				recipeId,
				commentText,
				usersId,
			};

			await commentModel.commentInsertData(data);
			success(res, {
				code: 200,
				status: "success",
				message: "berhasil menambahkan comment",
				data: data,
				pagination: [],
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "error",
				message: err.message,
				error: [],
			});
			return;
		}
	},
	commentEdit: async (req, res) => {
		try {
			const id = req.params.id;
			const { commentText } = req.body;

			const data = {
				commentText,
				id,
			};
			await commentModel.commentEditData(data);
			//const data = await commentModel.commentEditData(
			//	id,
			//	recipeId,
			//	commentText,
			//	usersId
			//);
			if (data.rowCount === 0) {
				const err = {
					message: `Edit data gagal karena comment id ${id} tidak ditemukan`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			success(res, {
				code: 200,
				status: "success",
				message: `Edit data comment dengan id ${id} berhasil`,
				data: data,
				pagination: [],
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "error",
				message: err.message,
				error: [],
			});
			return;
		}
	},
	commentDelete: async (req, res) => {
		try {
			const id = req.params.id;
			const data = await commentModel.commentDeleteData(id);
			if (data.rowCount === 0) {
				const err = {
					message: `Delete data gagal, karena id ${id} tidak ditemukan`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}

			success(res, {
				code: 200,
				status: "success",
				message: `Delete data comment id ${id} berhasil`,
				data: null,
				pagination: [],
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "error",
				message: err.message,
				error: [],
			});
			return;
		}
	},
	commentByRecipe: async (req, res) => {
		try {
			const recipeId = req.params.recipeId;
			const data = await commentModel.commentByRecipeData(recipeId);
			if (data.rowCount === 0) {
				const err = {
					message: `Data comment dengan recipe_id ${recipeId} tidak ditemukan`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			success(res, {
				code: 200,
				status: "success",
				message: "berhasil menampilkan data comment dan recipe",
				data: data.rows,
				pagination: [],
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "error",
				message: err.message,
				error: [],
			});
			return;
		}
	},
};
module.exports = commentController;
