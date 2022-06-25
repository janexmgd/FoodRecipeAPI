const express = require("express");

// import controller
const {
	recipeAdmin,
	recipeMain,
	recipeDetail,
	recipeInsert,
	recipeEdit,
	recipeDelete,
	myRecipe,
	latest5Recipe,
	recipeByUsers,
	recipeMode,
} = require("../controllers/recipe.controller");
const jwtAuth = require("../middleware/jwtAuth");

// import middleware
const {
	isAdmin,
	isCustomer,
	isOwnedRecipe,
} = require("../middleware/authorization");
const upload = require("../middleware/upload");
const {
	addRecipeValidation,
	updateRecipeValidation,
	modeChangeValidation,
} = require("../validations/recipe.validation");
const validation = require("../middleware/validation");

const recipeRoute = express.Router();

recipeRoute
	.get("/recipe/admin", jwtAuth, isAdmin, recipeAdmin) // admin only
	.get("/recipe", jwtAuth, isCustomer, recipeMain) // customer only
	.get("/recipe/:id", jwtAuth, isCustomer, recipeDetail) // customer
	.post(
		"/recipe",
		jwtAuth,
		isCustomer,
		upload,
		addRecipeValidation,
		validation,
		recipeInsert
	) // just customer
	.put(
		"/recipe/:id",
		jwtAuth,
		isOwnedRecipe,
		upload,
		updateRecipeValidation,
		validation,
		recipeEdit
	) // just owned recipe
	.delete("/recipe/:id", jwtAuth, isOwnedRecipe, recipeDelete) // just owned recipe
	.get("/recipe/users/my_recipe", jwtAuth, isCustomer, myRecipe)
	.get("/recipe/all/latest", latest5Recipe) // public
	.get("/recipe/users/:usersId", jwtAuth, isAdmin, recipeByUsers) // its to search recipe by users.id
	.put(
		"/recipe/mode/:id",
		jwtAuth,
		isAdmin,
		modeChangeValidation,
		validation,
		recipeMode
	); // change mode recipe
module.exports = recipeRoute;
