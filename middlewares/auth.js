import ErrorHandler from "./error.js";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
	const { token } = req.cookies;
	console.log(req.cookies);
	console.log(token);
	if (!token) {
		return next(new ErrorHandler("User Not Authorized", 401));
	}
	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	req.user = await User.findById(decoded.id);

	next();
});
