require("dotenv").config();

module.exports = {
	// email send
	APP_URL: process.env.APP_URL,
	GMAIL_USER: process.env.GMAIL_USER,
	GMAIL_PASS: process.env.GMAIL_PASS,
	GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
};
