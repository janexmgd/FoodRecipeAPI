const db = require("../config/db");
const authModel = {
	registerData: (data) => {
		return new Promise((resolve, reject) => {
			const {
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
			} = data;
			db.query(
				`INSERT INTO users(id,name,email,phone,password,photo,level,is_active,verify_token,is_verified) VALUES ('${id}','${name}','${email}','${phone}','${passwordHashed}','${photo}','${level}',${isActive},'${verifyToken}',${isVerified})`,
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
	verifyTokenCheck: (verifyToken) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM users WHERE verify_token='${verifyToken}'`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	verifyingUser: (verifyToken) => {
		return new Promise((resolve, reject) => {
			db.query(
				`UPDATE users SET is_verified=1, is_active=1, verify_token=null WHERE verify_token='${verifyToken}'`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
};
module.exports = authModel;
