/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
/* eslint-disable no-unneeded-ternary */
const recipeModel = require("../models/recipe.model");
const { success, failed } = require("../helpers/response");
const { v4: uuidv4 } = require("uuid");
const deleteFile = require("../helpers/deleteFile");

const recipeController = {
	recipeAdmin: async (req, res) => {
		try {
			const { search, page, limit, sort, mode } = req.query;
			const searchQuery = search || "";
			const pageValue = page ? Number(page) : 1;
			const limitValue = limit ? Number(limit) : 5;
			const offsetValue = (pageValue - 1) * limitValue;
			const sortQuery = sort ? sort : "title";
			const modeQuery = mode ? mode : "ASC";
			const alldata = await recipeModel.Alldata();
			const totalData = Number(alldata.rows[0].total);
			const data = await recipeModel.recipeAdminData(
				searchQuery,
				offsetValue,
				limitValue,
				sortQuery,
				modeQuery
			);
			//if (data.rowCount === 0) {
			//	const err = {
			//		message: `tidak ditemukan data dengan kata kunci ${searchQuery}`,
			//	};
			//	failed(res, {
			//		code: 500,
			//		status: "error",
			//		message: err.message,
			//		error: [],
			//	});
			//	return;
			//}
			// cek pakai search apa enggak
			if (search) {
				const pagination = {
					currentPage: pageValue,
					dataPerPage: limitValue,
					totalPage: Math.ceil(data.rowCount / limitValue),
				};
				success(res, {
					code: 200,
					status: "success",
					message: `Success get Recipe`,
					data: data.rows,
					pagination: pagination,
				});
			} else {
				const pagination = {
					currentPage: pageValue,
					dataPerPage: limitValue,
					totalPage: Math.ceil(totalData / limitValue),
				};

				success(res, {
					code: 200,
					status: "success",
					message: `Success get Recipe`,
					data: data.rows,
					pagination: pagination,
				});
			}
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
	recipeMain: async (req, res) => {
		try {
			const { search, page, limit, sort, mode } = req.query;
			const searchQuery = search || "";
			const pageValue = page ? Number(page) : 1;
			const sortQuery = sort ? sort : "title";
			const modeQuery = mode ? mode : "ASC";
			const limitValue = limit ? Number(limit) : 100;
			const offsetValue = (pageValue - 1) * limitValue;
			const alldata = await recipeModel.activeData();
			const totalData = Number(alldata.rows[0].total);
			const data = await recipeModel.recipeMainData(
				searchQuery,
				offsetValue,
				limitValue,
				sortQuery,
				modeQuery
			);
			//if (data.rowCount === 0) {
			//	const err = {
			//		message: `tidak ditemukan data dengan kata kunci ${searchQuery}`,
			//	};
			//	failed(res, {
			//		code: 500,
			//		status: "error",
			//		message: err.message,
			//		error: [],
			//	});
			//	return;
			//}
			// cek pakai search apa enggak
			if (search) {
				const pagination = {
					currentPage: pageValue,
					dataPerPage: limitValue,
					totalPage: Math.ceil(data.rowCount / limitValue),
				};
				//return console.log(pagination);
				success(res, {
					code: 200,
					status: "success",
					message: `Success get Recipe`,
					data: data.rows,
					pagination: pagination,
				});
			} else {
				const pagination = {
					currentPage: pageValue,
					dataPerPage: limitValue,
					totalPage: Math.ceil(totalData / limitValue),
				};
				//return console.log(pagination);
				success(res, {
					code: 200,
					status: "success",
					message: `Success get Recipe`,
					data: data.rows,
					pagination: pagination,
				});
			}
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
	recipeDetail: async (req, res) => {
		try {
			const id = req.params.id;
			const data = await recipeModel.recipeDetailData(id);
			if (data.rows[0].is_active === 0) {
				const err = {
					message: `Maaf recipe id ${id} sedang nonaktif`,
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
				message: `Success get Recipe with id ${id}`,
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
	recipeInsert: async (req, res) => {
		try {
			const { title, ingredients, video } = req.body;
			if (!req.file) {
				const err = {
					message: `u need to upload photo for this recipe`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
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
			// return console.log(data);
			await recipeModel.recipeInsertData(data);

			success(res, {
				code: 200,
				status: "success",
				message: "Berhasil menambahkan recipe",
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
	recipeEdit: async (req, res) => {
		try {
			const id = req.params.id;
			const { title, ingredients, video } = req.body;

			const detailOld = await recipeModel.recipeDetailData(id);
			if (detailOld.rowCount === 0) {
				const err = {
					message: `Data tidak diedit karena recipe ${id} tidak ditemukan`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			const date = new Date().toISOString();
			const usersId = req.APP_DATA.tokenDecoded.id;

			let data;
			if (req.file) {
				// return console.log(detailOld.rows[0].photo);
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
			success(res, {
				code: 200,
				status: "success",
				message: "success edit recipe",
				data: dataEdited.rows[0],
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
	recipeDelete: async (req, res) => {
		try {
			const id = req.params.id;
			const detailRecipe = await recipeModel.recipeDetailData(id);
			if (detailRecipe.rowCount === 0) {
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
			// return console.log(detailRecipe.rows[0].photo);

			// deleting photo
			deleteFile(`public/${detailRecipe.rows[0].photo}`);
			await recipeModel.recipeDeleteData(id);
			success(res, {
				code: 200,
				status: "success",
				message: "success delete user",
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
	myRecipe: async (req, res) => {
		try {
			const usersId = req.APP_DATA.tokenDecoded.id;
			const data = await recipeModel.myRecipeData(usersId);
			if (data.rowCount === 0) {
				const err = {
					message: `Anda belum punya recipe`,
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
				message: "berhasil menampilkan recipe anda",
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
	latest5Recipe: async (req, res) => {
		try {
			const data = await recipeModel.latest5RecipeData();
			success(res, {
				code: 200,
				status: "success",
				message: "Sukses mendapatkan 5 resep terbaru",
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
	recipeByUsers: async (req, res) => {
		try {
			const usersId = req.params.usersId;
			const data = await recipeModel.recipeByUsersData(usersId);
			if (data.rowCount === 0) {
				const err = {
					message: `Data recipe users_id ${usersId} tidak ditemukan`,
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
				message: "berhasil mendapatkan data recipe dan user",
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
	recipeMode: async (req, res) => {
		try {
			const id = req.params.id;
			const { isActive } = req.body;
			const detailRecipe = await recipeModel.recipeDetailData(id);

			if (detailRecipe.rowCount === 0) {
				const err = {
					message: `recipe with id ${id} not found`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (detailRecipe.rows[0].is_active === 1 && isActive === 1) {
				const err = {
					message: `recipe is already active`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (detailRecipe.rows[0].is_active === 0 && isActive === 0) {
				const err = {
					message: `recipe is already nonactive`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			await recipeModel.recipeModeData(id, isActive);
			const updatedRecipe = await recipeModel.recipeDetailData(id);
			success(res, {
				code: 200,
				status: "success",
				message: "success ganti mode recipe",
				data: updatedRecipe.rows[0],
				pagination: [],
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: error.message,
				error: [],
			});
			return;
		}
	},
};

module.exports = recipeController;
