// importexpressjs
const express = require("express");
// import cors
const cors = require("cors");
// import xss-clean
const xssClean = require("xss-clean");
// import helmet
const helmet = require("helmet");
// importbody-parser
const bodyParser = require("body-parser");
// import-user.route
const userRoute = require("./src/routes/user.route");
// import-recipe.route
const recipeRoute = require("./src/routes/recipe.route");
// import-comment.route
const commentRoute = require("./src/routes/comment.route");
// import-auth.route
const authRoute = require("./src/routes/auth.route");
// import-dotenv
require("dotenv").config();
const app = express();
app.use(
	helmet({
		crossOriginResourcePolicy: false,
	})
);
app.use(xssClean());
app.use(cors());
app.use(bodyParser.json());
app.use(userRoute);
app.use(recipeRoute);
app.use(commentRoute);
app.use(authRoute);
app.use(express.static("public"));
const PORT = process.env.LISTENPORT || 3004;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`service RUN at port ${PORT}`);
});
