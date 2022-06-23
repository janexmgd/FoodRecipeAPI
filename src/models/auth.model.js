const db = require("../config/db");
const authModel = {
	registerData: (data) => {
		return new Promise((resolve, reject) => {
			const {
				name,
				email,
				phone,
				passwordHashed,
				level,
				isActive,
				photo,
				verifyToken,
				isVerified,
			} = data;
			db.query(
				`INSERT INTO users(name,email,phone,password,photo,level,is_active,verify_token,is_verified) VALUES ('${name}','${email}','${phone}','${passwordHashed}','${photo}','${level}',${isActive},'${verifyToken}',${isVerified})`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	loginData: (email) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT password,is_active FROM users WHERE email='${email}'`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	checkUsername: (email) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
	emailCheck: (email) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
};
module.exports = authModel;
