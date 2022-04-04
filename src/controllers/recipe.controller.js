const recipeModel = require("../models/recipe.model")
const {
    success,
    failed
} = require('../helpers/response')
const recipeController = {
    recipeAdmin: async (req, res) => {
        try {
            const {
                search,
                page,
                limit
            } = req.query
            const searchQuery = search || ""
            const pageValue = page ? Number(page) : 1
            const limitValue = limit ? Number(limit) : 5
            const offsetValue = (pageValue - 1) * limitValue
            const alldata = await recipeModel.Alldata()
            const totalData = Number(alldata.rows[0].total)
            const data = await recipeModel.recipeAdminData(searchQuery, offsetValue, limitValue)
            if (data.rowCount === 0) {
                throw Error(`tidak ditemukan data dengan kata kunci ${searchQuery}`)
            }
            // cek pakai search apa enggak
            if (search) {
                const pagination = {
                    currentPage: pageValue,
                    dataPerPage: limitValue,
                    totalPage: Math.ceil(data.rowCount / limitValue)
                }
                success(res, data.rows, 'success', 'get data success', pagination)
            } else {
                const pagination = {
                    currentPage: pageValue,
                    dataPerPage: limitValue,
                    totalPage: Math.ceil(totalData / limitValue)
                }
                success(res, data.rows, 'success', 'get data success', pagination)
            }
        } catch (err) {
            failed(res, err.message, 'failed', 'internal server error')
        }
    },
    recipeMain: async (req, res) => {
        try {
            const {
                search,
                page,
                limit
            } = req.query
            const searchQuery = search || ""
            const pageValue = page ? Number(page) : 1
            const limitValue = limit ? Number(limit) : 5
            const offsetValue = (pageValue - 1) * limitValue
            const alldata = await recipeModel.activeData()
            const totalData = Number(alldata.rows[0].total)
            const data = await recipeModel.recipeMainData(searchQuery, offsetValue, limitValue)
            if (data.rowCount === 0) {
                throw Error(`data not found`)
            }
            // cek pakai search apa enggak
            if (search) {
                const pagination = {
                    currentPage: pageValue,
                    dataPerPage: limitValue,
                    totalPage: Math.ceil(data.rowCount / limitValue)
                }
                success(res, data.rows, 'success', 'get data success', pagination)
            } else {
                const pagination = {
                    currentPage: pageValue,
                    dataPerPage: limitValue,
                    totalPage: Math.ceil(totalData / limitValue)
                }
                success(res, data.rows, 'success', 'get data success', pagination)
            }
        } catch (err) {
            failed(res, err.message, 'failed', 'internal server error')
        }
    },
    recipeDetail: async (req, res) => {
        try {
            const id = req.params.id
            const data = await recipeModel.recipeDetailData(id)
            // console.log(data.rows[0].is_active);
            if (data.rows[0].is_active === 0) {
                throw Error(`Maaf recipe id ${id} sedang nonaktif`)
            }
            success(res, data.rows[0], 'success', `Ditemukan data recipe dengan id ${id}`)
        } catch (err) {
            failed(res, err.message, 'failed', 'internal server error')
        }
    },
    recipeInsert: async (req, res) => {
        try {
            const {
                title,
                ingredients
            } = req.body

            const isActive = 1
            const photo = req.files.photo ? req.files.photo[0].filename : ""
            const video = req.files.video ? req.files.video[0].filename : ""
            // input usersId from decoded jwt auth
            const usersId = req.APP_DATA.tokenDecoded.id
            // input date from js built in function with iso string format
            const date = new Date().toISOString()
            // check the required input is filled in all
            if (!title || !ingredients) {
                throw Error('Field tittle, ingredients, isActive belum terisi semua')
            }
            const data = await recipeModel.recipeInsertData(photo, title, ingredients, video, date, usersId, isActive)
            success(res, data, 'success', 'berhasil menambahkan recipe')
        } catch (err) {
            failed(res, err.message, 'failed', 'internal server error')
        }
    },
    recipeEdit: async (req, res) => {
        try {
            const id = req.params.id
            const {
                title,
                ingredients,
            } = req.body
            const a = await recipeModel.recipeDetailData(id)
            const photo = req.files.photo ? req.files.photo[0].filename : a.rows[0].photo
            const video = req.files.video ? req.files.video[0].filename : a.rows[0].video
            const date = new Date().toISOString()
            const usersId = req.APP_DATA.tokenDecoded.id
            const isActive = 1
            // validation for input
            if (!title || !ingredients || !isActive) {
                throw Error('Field title, ingredients, isActive belum terisi semua')
            }
            const data = await recipeModel.recipeEditData(id, photo, title, ingredients, video, date, usersId, isActive)
            // data change ?
            if (data.rowCount === 0) {
                throw Error(`Data tidak diedit karena recipe ${id} tidak ditemukan`)
            }
            success(res, data, 'success', 'berhasil edit recipe')
        } catch (err) {
            failed(res, err.message, failed, 'error')
        }
    },
    recipeDelete: async (req, res) => {
        try {
            const id = req.params.id
            const data = await recipeModel.recipeDeleteData(id)
            if (data.rowCount === 0) {
                throw Error(`Delete data gagal, karena id ${id} tidak ditemukan`)
            }
            success(res, data, 'success', `Delete recipe dengan id ${id} berhasil`)
        } catch (err) {
            failed(res, err.message, 'failed', 'error')
        }
    },
    myRecipe: async (req, res) => {
        try {
            const usersId = req.APP_DATA.tokenDecoded.id
            const data = await recipeModel.myRecipeData(usersId)
            if (data.rowCount === 0) {
                throw Error(`Anda belum mempunyai resep`)
            }
            success(res, data.rows, 'success', 'berhasil menampilkan recipe anda')
        } catch (error) {
            failed(res, error.message, 'failed', 'error')
        }
    },
    latest5Recipe: async (req, res) => {
        try {
            const data = await recipeModel.latest5RecipeData()
            success(res, data.rows, 'success', 'Sukses mendapatkan 5 resep terbaru')
        } catch (err) {
            failed(res, err.message, 'failed', 'failed get data')
        }
    },
    recipeByUsers: async (req, res) => {
        try {
            const usersId = req.params.usersId
            const data = await recipeModel.recipeByUsersData(usersId)
            if (data.rowCount === 0) {
                throw Error(`Data recipe users_id ${usersId} tidak ditemukan`)
            }
            success(res, data.rows, 'success', 'berhasil mendapatkan data recipe dan user')
        } catch (err) {
            failed(res, err.message, 'failed', 'error occurred')
        }
    },
    recipeMode: async (req, res) => {
        try {
            const id = req.params.id
            const {
                isActive
            } = req.body
            if (isActive > 1 || isActive < 0) {
                throw Error('invalid input')
            }
            const data = await recipeModel.recipeModeData(id, isActive)
            if (data.rowCount === 0) {
                throw Error(`invalid id`)
            }
            success(res, data, 'success', `berhasil mengubah mode recipe id ${id}`)
        } catch (error) {
            failed(res, error.message, 'failed', 'failed update')
        }
    }
}

module.exports = recipeController