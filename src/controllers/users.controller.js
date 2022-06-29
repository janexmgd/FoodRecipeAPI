const userModel = require("../models/user.model");
const { success, failed } = require("../helpers/response");
const bcrypt = require("bcrypt");
const deleteFile = require("../helpers/deleteFile");
const userController = {
	usersAll: async (req, res) => {
		try {
			const { page, limit } = req.query;
			const pageValue = page ? Number(page) : 1;
			const limitValue = limit ? Number(limit) : 4;
			const offsetValue = (pageValue - 1) * limitValue;
			const alldata = await userModel.Alldata();
			const totalData = Number(alldata.rows[0].total);
			const data = await userModel.usersAllData(offsetValue, limitValue);
			const pagination = {
				currentPage: pageValue,
				dataPerPage: limitValue,
				totalPage: Math.ceil(totalData / limitValue),
			};
			success(res, {
				code: 200,
				status: "success",
				message: `Success get data user`,
				data: data.rows,
				pagination: pagination,
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "error",
				message: error.message,
				error: [],
			});
			return;
		}
	},
	usersDetail: async (req, res) => {
		try {
			const id = req.params.id; // use for catch id
			const data = await userModel.usersDetailData(id);
			//   console.log(data.rows[0].photo);
			if (data.rowCount === 0) {
				const err = {
					message: `User with id ${id} not found`,
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
				message: `Success get user with id ${id}`,
				data: data.rows[0],
				pagination: [],
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "error",
				message: error.message,
				error: [],
			});
			return;
		}
	},
	usersEdit: async (req, res) => {
		try {
			const id = req.APP_DATA.tokenDecoded.id;
			//return console.log(id);
			const { name, email, phone } = req.body;

			// const photo = req.files.photo ? req.files.photo[0].filename : "";
			const a = await userModel.usersDetailData(id);
			let data;
			if (req.file) {
				//console.log(a.rows[0].photo);
				deleteFile(`public/${a.rows[0].photo}`);

				data = await userModel.usersEditData(
					id,
					name,
					email,
					phone,
					req.file.filename
				);
			} else {
				data = await userModel.usersEditData(
					id,
					name,
					email,
					phone,
					a.rows[0].photo
				);
			}

			if (data.rowCount === 0) {
				const err = {
					message: `Edit data users gagal karena users dengan id ${id} tidak ditemukan`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			const dataEdited = await userModel.usersDetailData(id);
			//return console.log(dataEdited);
			success(res, {
				code: 200,
				status: "success",
				message: "Success Update user",
				data: dataEdited.rows[0],
			});
		} catch (err) {
			failed(res, {
				code: 500,
				status: "Failed",
				message: "Internal Server Error",
				error: error.message,
			});
			return;
		}
	},
	usersDelete: async (req, res) => {
		try {
			const id = req.APP_DATA.tokenDecoded.id;
			const user = await userModel.usersDetailData(id);
			if (user.rowCount === 0) {
				const err = {
					message: `delete data users gagal karena users dengan id ${id} tidak ditemukan`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			// menghapus photo jika ada
			deleteFile(`public/${user.rows[0].photo}`);
			await userModel.usersDeleteData(id);
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
	usersMode: async (req, res) => {
		try {
			const id = req.params.id;
			const { isActive } = req.body;
			const user = await userModel.usersDetailData(id);
			if (user.rowCount == 0) {
				const err = {
					message: `user with id ${id} not found`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			//return console.log(user.rows[0].is_active);
			if (user.rows[0].is_active == 1 && isActive == 1) {
				const err = {
					message: `user is already active`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (user.rows[0].is_active == 0 && isActive == 0) {
				const err = {
					message: `user is already nonactive`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			await userModel.usersModeData(id, isActive);
			const userEdited = await userModel.usersDetailData(id);
			success(res, {
				code: 200,
				status: "success",
				message: "success ganti mode users",
				data: userEdited.rows[0],
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
	usersResetPass: async (req, res) => {
		try {
			const { confirmNewPass, newPass } = req.body;
			if (confirmNewPass === newPass) {
				const id = req.APP_DATA.tokenDecoded.id;
				const hashNewPass = await bcrypt.hash(newPass, 10);
				userModel
					.usersResetPassData(id, hashNewPass)
					.then((result) => {
						success(res, {
							code: 200,
							status: "success",
							message: "success ganti mode recipe",
							data: result,
							pagination: [],
						});
					})
					.catch((err) => {
						failed(res, {
							code: 500,
							status: "error",
							message: err.message,
							error: [],
						});
						return;
					});
			} else {
				failed(res, {
					code: 500,
					status: "error",
					message: "newPass dan confirmNewPass harus sama",
					error: [],
				});
				return;
			}
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
module.exports = userController;
