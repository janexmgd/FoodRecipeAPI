// import env
require("dotenv").config();
const jwt = require("jsonwebtoken");

const { failed } = require("../helpers/response");

module.exports = (req, res, next) => {
	try {
		const { token } = req.headers;

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.APP_DATA = {
			tokenDecoded: decoded,
		};
		next();
	} catch (error) {
		//return console.log(error);
		failed(res, error.message, "failed", "invalid token");
	}
};
