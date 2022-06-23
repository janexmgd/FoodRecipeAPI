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
			success(res, data.rows, "success", "get data success", pagination);
		} catch (err) {
			failed(res, err.message, "failed", "internal server error");
		}
	},
	usersDetail: async (req, res) => {
		try {
			const id = req.params.id; // use for catch id
			const data = await userModel.usersDetailData(id);
			//   console.log(data.rows[0].photo);
			if (data.rowCount === 0) {
				throw Error(`Data dengan id ${id} tidak ditemukan`);
			}
			success(res, data.rows[0], "success", `get data id ${id} success`);
		} catch (err) {
			failed(res, err.message, "failed", "Error");
		}
	},
	usersEdit: async (req, res) => {
		try {
			const id = req.params.id;
			const { name, email, phone } = req.body;

			// const photo = req.files.photo ? req.files.photo[0].filename : "";
			if (!name || !email || !phone) {
				// validation for input
				throw Error("Field name,email,phone belum terisi semua");
			}
			const a = await userModel.usersDetailData(id);
			let data;
			if (req.file) {
				console.log(a.rows[0].photo);
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
				throw Error(
					`Edit data users gagal karena users dengan id ${id} tidak ditemukan`
				);
			}

			success(res, data, "success", `success edit data id ${id}`);
		} catch (err) {
			failed(res, err.message, "failed", "internal server error");
		}
	},
	usersDelete: async (req, res) => {
		try {
			const id = req.params.id;
			const user = await userModel.usersDetailData(id);
			if (user.rowCount === 0) {
				throw Error(`Delete data gagal, karena id ${id} tidak ditemukan`);
			}
			// menghapus photo jika ada
			deleteFile(`public/${user.rows[0].photo}`);
			await userModel.usersDeleteData(id);
			success(res, null, "success", `delete data id ${id} success`);
		} catch (err) {
			failed(res, err.message, "failed", "internal server error");
		}
	},
	usersMode: async (req, res) => {
		try {
			const id = req.params.id;
			const { isActive } = req.body;
			const data = await userModel.usersModeData(id, isActive);
			if (data.rowCount === 0) {
				throw Error(`Change mode users gagal, karena id ${id} tidak ditemukan`);
			}
			success(res, data, "success", "success ganti mode users");
		} catch (err) {
			failed(res, err.message, "failed", "internal server error");
		}
	},
	usersResetPass: async (req, res) => {
		try {
			const { confirmNewPass, newPass } = req.body;
			if (confirmNewPass === newPass) {
				const id = req.APP_DATA.tokenDecoded.id;
				const hashNewPass = await bcrypt.hashSync(newPass, 10);
				userModel
					.usersResetPassData(id, hashNewPass)
					.then((result) => {
						success(res, result, "success", "register berhasil", null);
					})
					.catch((err) => {
						failed(res, err.detail, "failed", "register gagal");
					});
			} else {
				throw Error("newPass dan confirmNewPass harus sama");
			}
		} catch (error) {
			failed(res, error.message, "failed", "Internal server error");
		}
	},
};
module.exports = userController;
