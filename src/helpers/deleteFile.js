const fs = require("fs");

module.exports = (path) => {
	// cek apakah file ada atau tidak
	if (fs.existsSync(path)) {
		// delete file
		// console.log("deleted");
		fs.unlinkSync(path);
	} else {
		console.log("not deleted");
	}
};
