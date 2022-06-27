/* eslint-disable no-unused-vars */
const { success, failed, successWithToken } = require("../helpers/response");
const bcrypt = require("bcrypt");
const jwtToken = require("../helpers/generateJwtToken");
const authModel = require("../models/auth.model");
const crypto = require("crypto");
const sendEmail = require("../helpers/sendEmail");
const deleteFile = require("../helpers/deleteFile");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	register: async (req, res) => {
		try {
			const { name, email, phone, password } = req.body;
			const emailCheck = await authModel.emailCheck(email);
			// cek apakah upload file
			if (!req.file) {
				const err = {
					message: "u need to upload your display picture for your profile",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (emailCheck.rowCount > 0) {
				// console.log(req.file.filename);
				deleteFile(`public/${req.file.filename}`);
				const err = {
					message: "email is already registered",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (!name || !email || !phone || !password) {
				const err = {
					message: "Field name, email, phone, password belum terisi semua",
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
			const level = 1;
			const isActive = 0;
			const photo = req.file ? req.file.filename : "";
			const verifyToken = crypto.randomBytes(32).toString("hex");
			const passwordHashed = await bcrypt.hash(password, 10);
			const isVerified = 0;
			const data = {
				id,
				name,
				email,
				phone,
				passwordHashed,
				level,
				isActive,
				photo,
				verifyToken,
				isVerified,
			};
			authModel
				.registerData(data)
				.then(() => {
					const username = name;
					sendEmail.sendConfirmationEmail(email, verifyToken, username);
					success(res, data, "success", "register berhasil", null);
				})
				.catch((err) => {
					// console.log(err);
					failed(res, {
						code: 500,
						status: "error",
						message: err.message,
						error: [],
					});
					return;
				});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: error.message,
				error: [],
			});
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				throw Error("Form belum diisi semua");
			}
			// mengambil data di column yang email nya sama dengan email req body
			authModel
				.checkUsername(email)
				.then((result) => {
					// cek apakah ada data yang cocok dengan email?
					if (result.rowCount > 0) {
						if (result.rows[0].verify_token == null) {
							if (result.rows[0].is_verified == 1) {
								if (result.rows[0].is_active === 1) {
									// compare password from body dgn password db
									bcrypt
										.compare(password, result.rows[0].password)
										.then(async (match) => {
											// compare berhasil?
											if (match) {
												// login sukses dan memberi token
												const token = await jwtToken(result.rows[0]);
												success(res, {
													code: 200,
													status: "success",
													message: "login success",
													token: token,
												});
											} else {
												// login gagal
												const err = {
													message: "e-mail or password wrong",
												};
												failed(res, {
													code: 500,
													status: "error",
													message: err.message,
													error: [],
												});
											}
										});
								} else {
									const err = {
										message: "account is blocked",
									};
									failed(res, {
										code: 500,
										status: "error",
										message: err.message,
										error: [],
									});
								}
							} else {
								const err = {
									message: "e-mail is not verified",
								};
								failed(res, {
									code: 500,
									status: "error",
									message: err.message,
									error: [],
								});
							}
						} else {
							const err = {
								message: "e-mail is not verified",
							};
							failed(res, {
								code: 500,
								status: "error",
								message: err.message,
								error: [],
							});
						}
					} else {
						// email tidak ada
						const err = {
							message: "email not registered",
						};
						failed(res, {
							code: 500,
							status: "error",
							message: err.message,
							error: [],
						});
					}
				})
				.catch((err) => {
					failed(res, err.message, "failed", "internal server error");
				});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: error.message,
				error: [],
			});
		}
	},
	verifyEmail: async (req, res) => {
		try {
			const { token } = req.query;
			const verifyTokenCheck = await authModel.verifyTokenCheck(token);

			if (verifyTokenCheck.rowCount > 0) {
				authModel
					.verifyingUser(token)
					.then(() => {
						res.send({ message: "email is verified" });
					})
					.catch(() => {});
			} else {
				const err = {
					message: "verify token is invalid",
				};
				failed(res, err.message, "failed", "invalid argument");
			}
		} catch (error) {
			// console.log(error);
			failed(res, error, "failed", "internal server error");
		}
	},
};
