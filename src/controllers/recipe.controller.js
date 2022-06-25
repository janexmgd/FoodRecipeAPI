/* eslint-disable no-unneeded-ternary */
const recipeModel = require("../models/recipe.model");
const { success, failed } = require("../helpers/response");
const { v4: uuidv4 } = require("uuid");
const deleteFile = require("../helpers/deleteFile");

const recipeController = {
	recipeAdmin: async (req, res) => {
		try {
			const { search, page, limit } = req.query;
			const searchQuery = search || "";
			const pageValue = page ? Number(page) : 1;
			const limitValue = limit ? Number(limit) : 5;
			const offsetValue = (pageValue - 1) * limitValue;
			const alldata = await recipeModel.Alldata();
			const totalData = Number(alldata.rows[0].total);
			const data = await recipeModel.recipeAdminData(
				searchQuery,
				offsetValue,
				limitValue
			);
			if (data.rowCount === 0) {
				throw Error(`tidak ditemukan data dengan kata kunci ${searchQuery}`);
			}
			// cek pakai search apa enggak
			if (search) {
				const pagination = {
					currentPage: pageValue,
					dataPerPage: limitValue,
					totalPage: Math.ceil(data.rowCount / limitValue),
				};
				success(res, data.rows, "success", "get data success", pagination);
			} else {
				const pagination = {
					currentPage: pageValue,
					dataPerPage: limitValue,
					totalPage: Math.ceil(totalData / limitValue),
				};
				success(res, data.rows, "success", "get data success", pagination);
			}
		} catch (err) {
			failed(res, err.message, "failed", "internal server error");
		}
	},
	recipeMain: async (req, res) => {
		try {
			const { search, page, limit, sort } = req.query;
			const searchQuery = search || "";
			const pageValue = page ? Number(page) : 1;
			const sortQuery = sort ? sort : "id";
			const limitValue = limit ? Number(limit) : 100;
			const offsetValue = (pageValue - 1) * limitValue;
			const alldata = await recipeModel.activeData();
			const totalData = Number(alldata.rows[0].total);
			const data = await recipeModel.recipeMainData(
				searchQuery,
				offsetValue,
				limitValue,
				sortQuery
			);
			if (data.rowCount === 0) {
				throw Error(`data not found`);
			}
			// cek pakai search apa enggak
			if (search) {
				const pagination = {
					currentPage: pageValue,
					dataPerPage: limitValue,
					totalPage: Math.ceil(data.rowCount / limitValue),
				};
				success(res, data.rows, "success", "get data success", pagination);
			} else {
				const pagination = {
					currentPage: pageValue,
					dataPerPage: limitValue,
					totalPage: Math.ceil(totalData / limitValue),
				};
				success(res, data.rows, "success", "get data success", pagination);
			}
		} catch (err) {
			failed(res, err.message, "failed", "internal server error");
		}
	},
	recipeDetail: async (req, res) => {
		try {
			const id = req.params.id;
			const data = await recipeModel.recipeDetailData(id);
			if (data.rows[0].is_active === 0) {
				throw Error(`Maaf recipe id ${id} sedang nonaktif`);
			}
			success(
				res,
				data.rows[0],
				"success",
				`Ditemukan data recipe dengan id ${id}`
			);
		} catch (err) {
			failed(res, err.message, "failed", "internal server error");
		}
	},
	recipeInsert: async (req, res) => {
		try {
			const { title, ingredients, video } = req.body;
			if (!req.file) {
				throw Error("u need to upload photo for this recipe");
			}
			const id = uuidv4();
			const isActive = 1;
			const photo = req.file.filename;
			// input usersId from decoded jwt auth
			const usersId = req.APP_DATA.tokenDecoded.id;
			// input date from js built in function with iso string format
			const date = new Date().toISOString();
			// check the required input is filled in all

			const data = {
				id,
				title,
				ingredients,
				video,
				isActive,
				photo,
				usersId,
				date,
			};
			//return console.log(data);
			await recipeModel.recipeInsertData(data);

			success(res, data, "success", "berhasil menambahkan recipe");
		} catch (err) {
			failed(res, err.message, "failed", "internal server error");
		}
	},
	recipeEdit: async (req, res) => {
		try {
			const id = req.params.id;
			const { title, ingredients, video } = req.body;

			const detailOld = await recipeModel.recipeDetailData(id);
			if (detailOld.rowCount === 0) {
				throw Error(`Data tidak diedit karena recipe ${id} tidak ditemukan`);
			}
			const date = new Date().toISOString();
			const usersId = req.APP_DATA.tokenDecoded.id;

			let data;
			if (req.file) {
				//return console.log(detailOld.rows[0].photo);
				deleteFile(`public/${detailOld.rows[0].photo}`);

				data = await recipeModel.recipeEditData(
					id,
					title,
					ingredients,
					video,
					date,
					usersId,
					req.file.filename
				);
			} else {
				data = await recipeModel.recipeEditData(
					id,
					title,
					ingredients,
					video,
					date,
					usersId,
					detailOld.rows[0].photo
				);
			}

			const dataEdited = await recipeModel.recipeDetailData(id);
			success(res, dataEdited.rows[0], "success", "berhasil edit recipe");
		} catch (err) {
			failed(res, err.message, failed, "error");
		}
	},
	recipeDelete: async (req, res) => {
		try {
			const id = req.params.id;
			const detailRecipe = await recipeModel.recipeDetailData(id);
			if (detailRecipe.rowCount === 0) {
				throw Error(`Delete data gagal, karena id ${id} tidak ditemukan`);
			}
			//return console.log(detailRecipe.rows[0].photo);

			// deleting photo
			deleteFile(`public/${detailRecipe.rows[0].photo}`);
			await recipeModel.recipeDeleteData(id);
			success(res, null, "success", `Delete recipe dengan id ${id} berhasil`);
		} catch (err) {
			failed(res, err.message, "failed", "error");
		}
	},
	myRecipe: async (req, res) => {
		try {
			const usersId = req.APP_DATA.tokenDecoded.id;
			const data = await recipeModel.myRecipeData(usersId);
			if (data.rowCount === 0) {
				throw Error(`Anda belum mempunyai resep`);
			}
			success(res, data.rows, "success", "berhasil menampilkan recipe anda");
		} catch (error) {
			failed(res, error.message, "failed", "error");
		}
	},
	latest5Recipe: async (req, res) => {
		try {
			const data = await recipeModel.latest5RecipeData();
			success(res, data.rows, "success", "Sukses mendapatkan 5 resep terbaru");
		} catch (err) {
			failed(res, err.message, "failed", "failed get data");
		}
	},
	recipeByUsers: async (req, res) => {
		try {
			const usersId = req.params.usersId;
			const data = await recipeModel.recipeByUsersData(usersId);
			if (data.rowCount === 0) {
				throw Error(`Data recipe users_id ${usersId} tidak ditemukan`);
			}
			success(
				res,
				data.rows,
				"success",
				"berhasil mendapatkan data recipe dan user"
			);
		} catch (err) {
			failed(res, err.message, "failed", "error occurred");
		}
	},
	recipeMode: async (req, res) => {
		try {
			const id = req.params.id;
			const { isActive } = req.body;
			const detailRecipe = await recipeModel.recipeDetailData(id);

			if (detailRecipe.rowCount == 0) {
				throw Error(`invalid id`);
			}
			if (detailRecipe.rows[0].is_active == 1 && isActive == 1) {
				throw Error(`This recipe is already active`);
			}
			if (detailRecipe.rows[0].is_active == 0 && isActive == 0) {
				throw Error(`This recipe is already nonactive`);
			}
			await recipeModel.recipeModeData(id, isActive);
			const updatedRecipe = await recipeModel.recipeDetailData(id);
			success(
				res,
				updatedRecipe.rows[0],
				"success",
				`berhasil mengubah mode recipe id ${id}`
			);
		} catch (error) {
			failed(res, error.message, "failed", "failed update");
		}
	},
};

module.exports = recipeController;
