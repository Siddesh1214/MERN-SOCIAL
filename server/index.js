const express = require("express");
const dbConnect = require("./config/database");
const user = require("./routes/user");
const post = require("./routes/post");
const cookieParser = require("cookie-parser");
const cloudinary = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const cors = require('cors');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

//vip middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    // origin:'http://localhost:5173',
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
    httpOnly:true,
  })
);

//db connect
dbConnect();

//cloudinary connect
cloudinary.cloudinaryConnect();

app.use("/api/v1/user", user);
app.use("/api/v1/post", post);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
