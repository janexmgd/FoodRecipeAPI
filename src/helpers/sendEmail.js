const nodemailer = require("nodemailer");
const handlebars = require("nodemailer-express-handlebars");
const path = require("path");
const { GMAIL_APP_PASS, GMAIL_USER, APP_URL } = require("./env");

const transport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	secureConnection: false, // TLS requires secureConnection to be false
	auth: {
		user: GMAIL_USER,
		pass: GMAIL_APP_PASS,
	},
	tls: {
		ciphers: "SSLv3",
	},
});

module.exports = {
	sendConfirmationEmail: (email, confirmationCode, username) => {
		transport.use(
			"compile",
			handlebars({
				viewEngine: {
					extname: ".html",
					partialsDir: path.resolve("./src/template/email"),
					defaultLayout: false,
				},
				viewPath: path.resolve("./src/template/email"),
				extName: ".html",
			})
		);
		const mailOptions = {
			from: '"FOOD RECIPE" <admin@foodRecipe.co.id>',
			to: email,
			subject: "Please Confirm Your Account",
			text: "Confirm Your foodRecipe Account",
			template: "confirm-email",
			context: {
				url: `${APP_URL}/auth/verify-email?token=${confirmationCode}`,
				username: `${username}`,
			},
		};

		transport.sendMail(mailOptions, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(res);
			}
		});
	},
};
