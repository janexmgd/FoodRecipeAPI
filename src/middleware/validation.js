const { validationResult } = require("express-validator");
const { failed } = require("../helpers/response");
const deleteFile = require("../helpers/deleteFile");

module.exports = (req, res, next) => {
	try {
		const err = validationResult(req);
		if (err.isEmpty()) {
			return next();
		}
		const extractErr = [];
		err.array().map((errors) => extractErr.push(errors.msg));
		if (req.file) {
			deleteFile(`public/${req.file.filename}`);
		}
		return failed(res, extractErr, "failed", "failed in validation");
	} catch (error) {
		failed(res, error.message, "error", "internal server error");
	}
};
