const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
	mongoose
		.connect(process.env.DATABASE_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log("DB Connection Successful"))
		.catch((error) => {
			console.log(error);
			console.log("DB Connection issue");
			process.exit(1);
		});
};
module.exports = dbConnect;
