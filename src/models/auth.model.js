const db = require("../config/db")
const authModel = {
    registerData: (name, email, phone, passwordHash, photo, level, isActive) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO users(name,email,phone,password,photo,level,is_active) VALUES ('${name}','${email}','${phone}','${passwordHash}','${photo}','${level}',${isActive})`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    loginData: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT password,is_active FROM users WHERE email='${email}'`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    checkUsername: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email='${email}'`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    }
}
module.exports = authModel;