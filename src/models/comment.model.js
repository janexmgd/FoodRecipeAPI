const db = require('../config/db')
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
            db.query(`SELECT * FROM comment ORDER BY id LIMIT ${limitValue} OFFSET ${offsetValue}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    commentDetailData: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM comment WHERE id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })

    },
    commentInsertData: (recipeId, commentText, usersId) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO comment (recipe_id, comment_text, users_id) VALUES (${recipeId},'${commentText}',${usersId})`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    commentEditData: (id, recipeId, commentText, usersId) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE comment SET recipe_id=${recipeId},comment_text='${commentText}',users_id=${usersId} WHERE id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    commentDeleteData: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM comment WHERE id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    commentByRecipeData: (recipeId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT comment.id AS commentId,comment.recipe_id,comment.comment_text,comment.users_id AS commentUser_Id,recipe.id AS recipeId,recipe.photo,recipe.title,recipe.ingredients,recipe.video,recipe.date,recipe.users_id AS recipeUsers_id FROM comment INNER JOIN recipe ON comment.recipe_id = recipe.id WHERE comment.recipe_id=${recipeId}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
    getRecipeUsersId: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT users_id FROM comment where id=${id}`,
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
        })
    },
}
module.exports = commentModel