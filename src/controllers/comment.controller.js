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
			success(res, data.rows, "success", "get data success", pagination);
		} catch (err) {
			failed(res, err.message, "failed", "error occured");
		}
	},
	commentDetail: async (req, res) => {
		try {
			const id = req.params.id;
			const data = await commentModel.commentDetailData(id);
			if (data.rowCount === 0) {
				throw Error(`Data dengan id ${id} tidak ditemukan`);
			}
			success(res, data.rows[0], success, `Data dengan id ${id} ditemukan`);
		} catch (err) {
			failed(res, err.message, "failed", "error occured");
		}
	},
	commentInsert: async (req, res) => {
		try {
			const { recipeId, commentText } = req.body;
			const id = uuidv4();
			const findRecipe = await recipeModel.recipeDetailData(recipeId);

			if (findRecipe.rowCount == 0) {
				throw Error("recipe tidak ditemukan");
			}
			const usersId = req.APP_DATA.tokenDecoded.id;

			const data = {
				id,
				recipeId,
				commentText,
				usersId,
			};

			await commentModel.commentInsertData(data);
			success(res, data, "success", "berhasil menambahkan comment");
		} catch (err) {
			failed(res, err.message, "failed", "error occured");
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
				throw Error(`Edit data gagal karena comment id ${id} tidak ditemukan`);
			}
			success(
				res,
				data,
				"success",
				`Edit data comment dengan id ${id} berhasil`
			);
		} catch (err) {
			failed(res, err.message, "failed", "error occured");
		}
	},
	commentDelete: async (req, res) => {
		try {
			const id = req.params.id;
			const data = await commentModel.commentDeleteData(id);
			if (data.rowCount === 0) {
				throw Error(`Delete data gagal, karena id ${id} tidak ditemukan`);
			}
			success(res, null, "success", `Delete data comment id ${id} berhasil`);
		} catch (err) {
			failed(res, err.message, "failed", "error occured");
		}
	},
	commentByRecipe: async (req, res) => {
		try {
			const recipeId = req.params.recipeId;
			const data = await commentModel.commentByRecipeData(recipeId);
			if (data.rowCount === 0) {
				throw Error(
					`Data comment dengan recipe_id ${recipeId} tidak ditemukan`
				);
			}
			success(
				res,
				data.rows,
				"success",
				"berhasil menampilkan data comment dan recipe"
			);
		} catch (err) {
			failed(res, err.message, "failed", "error occured");
		}
	},
};
module.exports = commentController;
