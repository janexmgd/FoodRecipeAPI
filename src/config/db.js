const { Pool } = require("pg");
// const {
//     user,
//     port
// } = require('pg/lib/defaults')
require("dotenv").config();

const db = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	ssl: {
		rejectUnauthorized: false,
	},
});
db.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("DB CONNECTED");
	}
});
module.exports = db;
