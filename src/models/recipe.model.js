const db = require("../config/db");

const recipeModel = {
	Alldata: () => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT COUNT(*) AS total FROM recipe`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
	activeData: () => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT COUNT(*) AS total FROM recipe WHERE is_active=1`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	recipeAdminData: (
		searchQuery,
		offsetValue,
		limitValue,
		sortQuery,
		modeQuery
	) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM recipe WHERE LOWER(title) LIKE LOWER ('%${searchQuery}%') 
				ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	recipeMainData: (
		searchQuery,
		offsetValue,
		limitValue,
		sortQuery,
		modeQuery
	) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM recipe WHERE is_active=1 AND LOWER(title) LIKE LOWER ('%${searchQuery}%') 
				ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	recipeDetailData: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM recipe WHERE id='${id}'`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
	recipeInsertData: (data) => {
		return new Promise((resolve, reject) => {
			const { id, title, ingredients, video, isActive, photo, usersId, date } =
				data;
			db.query(
				`INSERT INTO recipe (id,photo, title, ingredients, video, date, users_id, is_active) VALUES ('${id}','${photo}','${title}','${ingredients}','${video}','${date}','${usersId}',${isActive})`,
				(err, result) => {
					if (err) {
						console.log(err);
					}
					resolve(result);
				}
			);
		});
	},
	recipeEditData: (id, title, ingredients, video, date, usersId, photo) => {
		return new Promise((resolve, reject) => {
			db.query(
				`UPDATE recipe SET photo='${photo}', title='${title}', 
        ingredients='${ingredients}', video='${video}', date='${date}', users_id='${usersId}' WHERE id='${id}'`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	recipeDeleteData: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM recipe WHERE id='${id}'`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
	myRecipeData: (usersId) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM recipe WHERE users_id = '${usersId}'`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	latest5RecipeData: () => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM recipe ORDER BY date DESC LIMIT 6`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	recipeByUsersData: (usersId) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT recipe.id AS idRecipe,recipe.photo AS recipePhoto,recipe.title,recipe.ingredients,recipe.video,recipe.date,recipe.users_id,users.id AS userId,users.name,users.email,users.phone,users.password,users.photo AS usersPhoto FROM recipe INNER JOIN users ON recipe.users_id = users.id WHERE recipe.users_id='${usersId}'`,
				(err, result) => {
					if (!err) {
						resolve(result);
					}
					reject(err);
				}
			);
		});
	},
	getRecipeUsersId: (id) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT users_id FROM recipe where id='${id}'`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	recipeModeData: (id, isActive) => {
		return new Promise((resolve, reject) => {
			db.query(
				`UPDATE recipe SET is_active=${isActive} WHERE id='${id}'`,
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

module.exports = recipeModel;
