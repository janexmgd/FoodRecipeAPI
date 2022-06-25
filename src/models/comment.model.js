const db = require("../config/db");
const commentModel = {
	Alldata: () => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT COUNT(*) AS total FROM comment`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
	commentAllData: (offsetValue, limitValue) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM comment ORDER BY id LIMIT ${limitValue} OFFSET ${offsetValue}`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	commentDetailData: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM comment WHERE id='${id}'`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
	commentInsertData: (data) => {
		return new Promise((resolve, reject) => {
			const { id, recipeId, commentText, usersId } = data;
			db.query(
				`INSERT INTO comment (id, recipe_id, comment_text, users_id) VALUES ('${id}','${recipeId}','${commentText}','${usersId}')`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	commentEditData: (data) => {
		return new Promise((resolve, reject) => {
			const { commentText, id } = data;
			db.query(
				`UPDATE comment SET comment_text='${commentText}' WHERE id='${id}'`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	commentDeleteData: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM comment WHERE id='${id}'`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
	commentByRecipeData: (recipeId) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT comment.id AS commentId,comment.recipe_id,comment.comment_text,comment.users_id AS commentUser_Id,recipe.id AS recipeId,recipe.photo,recipe.title,recipe.ingredients,recipe.video,recipe.date,recipe.users_id AS recipeUsers_id FROM comment INNER JOIN recipe ON comment.recipe_id = recipe.id WHERE comment.recipe_id='${recipeId}'`,
				(err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				}
			);
		});
	},
	getRecipeUsersId: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT users_id FROM comment where id=${id}`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},
};
module.exports = commentModel;
