const {
    success,
    failed,
    successWithToken
} = require('../helpers/response')
const bcrypt = require('bcrypt')
const jwtToken = require('../helpers/generateJwtToken')
const authModel = require('../models/auth.model')

module.exports = {
    register: async (req, res) => {
        try {
            // input data dari body
            // get filename from upload file
            // file upload
            // console.log(req.file.filename);
            // console.log(req.headers['content-length']);
            const {
                name,
                email,
                phone,
                password
            } = req.body
            const level = 1
            const isActive = 1
            const photo = req.files.photo ? req.files.photo[0].filename : ""
            if (!name || !email || !phone || !password) { // this for validation u cant empty this 
                throw Error('Field name, email, phone, password belum terisi semua')
            }
            // memberikan hash kepada password
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    failed(res, err.message, 'failed', 'hash password failed')
                }
                // input password yang sudah di hash melalui model
                authModel.registerData(name, email, phone, hash, photo, level, isActive)
                    .then((result) => {
                        success(res, result, 'success', 'register berhasil', null)
                    })
                    .catch((err) => {
                        failed(res, err.detail, 'failed', 'register gagal')
                    })
            })
        } catch (error) {
            failed(res, error.message, 'failed', 'Internal server error')
        }
    },
    login: async (req, res) => {
        try {
            const {
                email,
                password
            } = req.body
            if (!email || !password) {
                throw Error('Form belum diisi semua')
            }
            // mengambil data di column yang email nya sama dengan email req body
            authModel.checkUsername(email)
                .then((result) => {
                    console.log();
                    // cek apakah ada data yang cocok dengan email?
                    if (result.rowCount > 0) {
                        if (result.rows[0].is_active === 1) {
                            // compare password from body dgn password db
                            bcrypt.compare(password, result.rows[0].password)
                                .then(async (match) => {
                                    // compare berhasil?
                                    if (match) {
                                        // login sukses dan memberi token 
                                        const token = await jwtToken(result.rows[0])
                                        successWithToken(res, token, 'success', 'Login success')
                                    } else {
                                        // login gagal 
                                        failed(res, null, 'failed', 'email atau password salah')
                                    }
                                })
                        } else {
                            failed(res, null, 'failed', 'akun anda dinonaktifkan, kontak admin untuk mengaktifkan')
                        }
                    } else {
                        // email tidak ada
                        failed(res, null, 'failed', 'email atau password salah')
                    }
                })
                .catch((err) => {
                    failed(res, err.message, 'failed', 'internal server error')
                })
        } catch (error) {
            failed(res, error.message, 'failed', 'internal server error')
        }
    }
}