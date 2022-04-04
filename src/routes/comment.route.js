const express = require('express')

const commentRouter = express.Router();
const {
    commentAll,
    commentDetail,
    commentInsert,
    commentEdit,
    commentDelete,
    commentByRecipe
} = require('../controllers/comment.controller')
const jwtAuth = require('../middleware/jwtAuth')
const {
    isCustomer,
    isAdmin,
    isOwnedComment
} = require('../middleware/authorization')
commentRouter
    .get('/comment', jwtAuth, commentAll)
    .get('/comment/:id', jwtAuth, commentDetail)
    .post('/comment', jwtAuth, isCustomer, commentInsert)
    .put('/comment/:id', jwtAuth, isOwnedComment, commentEdit)
    .delete('/comment/:id', jwtAuth, isOwnedComment, commentDelete)
    .get('/comment/recipe/:recipeId', jwtAuth, isAdmin, commentByRecipe)

module.exports = commentRouter