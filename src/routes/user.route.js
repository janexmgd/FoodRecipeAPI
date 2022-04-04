const express = require('express');
// const {
//     register
// } = require('../controllers/auth.controller');

const router = express.Router();

const {
    usersAll,
    usersDetail,
    usersMode,
    usersEdit,
    usersDelete,
    usersResetPass
} = require('../controllers/users.controller')
// const authstatic = require('../middleware/staticAuth')
const jwtAuth = require('../middleware/jwtAuth')
const {
    isAdmin,
    isOwnedUser
} = require('../middleware/authorization')
const upload = require('../middleware/upload')
router
    .get('/users', jwtAuth, isAdmin, usersAll) // hanya admin
    .get('/users/:id', jwtAuth, isOwnedUser, usersDetail) // hanya users.id tsb
    .put('/users/:id', jwtAuth, isOwnedUser, upload, usersEdit) // hanya users.id tsb
    .delete('/users/:id', jwtAuth, isOwnedUser, usersDelete) // hanya users.id tsb
    .put('/users/mode_change/:id', jwtAuth, isAdmin, usersMode) // admin only change mode active or inactive
    .put('/modify/reset_pass', jwtAuth, usersResetPass) // reset password
module.exports = router