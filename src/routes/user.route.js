const express = require("express");
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
	usersResetPass,
} = require("../controllers/users.controller");

// import middleware
const jwtAuth = require("../middleware/jwtAuth");
const {
	isAdmin,
	isOwnedUser,
	isCustomer,
} = require("../middleware/authorization");
const upload = require("../middleware/upload");
const validation = require("../middleware/validation");
const {
	editUsersValidation,
	modeChangeValidation,
	modifyPassValidation,
} = require("../validations/users.validation");

router
	.get("/users", jwtAuth, isAdmin, usersAll) // hanya admin
	.get("/users/:id", jwtAuth, isOwnedUser, usersDetail) // hanya users.id tsb
	.put("/users", jwtAuth, upload, editUsersValidation, validation, usersEdit) // hanya users.id tsb
	.delete("/users", jwtAuth, isCustomer, usersDelete) // hanya users.id tsb
	.put(
		"/users/mode_change/:id",
		jwtAuth,
		isAdmin,
		modeChangeValidation,
		validation,
		usersMode
	) // admin only change mode active or inactive
	.put(
		"/modify/reset_pass",
		jwtAuth,
		modifyPassValidation,
		validation,
		usersResetPass
	); // reset password
module.exports = router;
