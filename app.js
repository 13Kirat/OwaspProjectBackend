import { config } from "dotenv";
import cookieParser from "cookie-parser"; // used to set cookies and authentication
import cors from "cors"; // used too connect frontend and backend
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import express from "express";
import fileUpload from "express-fileupload";

const app = express();
config({ path: "./config/config.env" });

app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		method: ["GET", "POST", "DELETE", "PUT"],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	fileUpload({
		// used to upload files like in multer
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);


dbConnection();

app.use(errorMiddleware);
export default app;
