const db = require("../config/db")

const userModel = {
    Alldata: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(*) AS total FROM users`, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    },
    usersAllData: (offsetValue, limitValue) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users ORDER BY id LIMIT ${limitValue} OFFSET ${offsetValue}`, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    },
    usersDetailData: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
        });
    },
    usersEditData: (id, name, email, phone, photo) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET name='${name}',email='${email}',phone='${phone}',photo='${photo}' WHERE id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    usersDeleteData: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM users WHERE id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    usersModeData: (id, isActive) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET is_active=${isActive} WHERE id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    usersResetPassData: (id, newPassword) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET password='${newPassword}' WHERE id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    }
}

module.exports = userModel;