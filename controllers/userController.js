import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
	console.log(req.body);
	// console.log(req.files);
	const {
		role,
		name,
		email,
		phone,
		password,
		collage,
		year,
		branch,
		rollNumber,
		companyName,
		companyEmail,
		companyPhone,
		companyWebsite,
		organizationName,
		organizationEmail,
		organizationPhone,
		organizationWebsite,
		secretCode,
	} = req.body;

	if (!role || !name || !email || !phone || !password) {
		return next(new ErrorHandler("Please fill full form!"));
	}

	const isEmail = await User.findOne({ email });
	const isPhone = await User.findOne({ phone });

	if (isEmail || isPhone) {
		return next(
			new ErrorHandler("Email Or Phone Number is already registered!")
		);
	}

	let user;

	if (role === "Student") {
		if (!collage || !year || !branch || !rollNumber) {
			return next(new ErrorHandler("Please fill full form!"));
		}
		user = await User.create({
			role,
			name,
			email,
			phone,
			password,
			collage,
			year,
			branch,
			rollNumber,
		});
	} else if (role === "Employer") {
		if (!companyName || !companyEmail || !companyPhone || !companyWebsite) {
			return next(new ErrorHandler("Please fill full form!"));
		}
		user = await User.create({
			role,
			name,
			email,
			phone,
			password,

			companyName,
			companyEmail,
			companyPhone,
			companyWebsite,
		});
	} else if (role === "Organizer") {
		if (!role || !name || !email || !phone || !password) {
			return next(new ErrorHandler("Please fill full form!"));
		}
		user = await User.create({
			role,
			name,
			email,
			phone,
			password,
			organizationName,
			organizationEmail,
			organizationPhone,
			organizationWebsite,
		});
	} else if (role === "Admin") {
		if (!secretCode) {
			return next(new ErrorHandler("Please fill full form!"));
		}
		user = await User.create({
			role,
			name,
			email,
			phone,
			password,
			secretCode,
		});
	}

	sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
	const { email, password, role } = req.body;
	if (!email || !password || !role) {
		return next(
			new ErrorHandler("Please provide email ,password and role.")
		);
	}
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(new ErrorHandler("Invalid Email Or Password.", 400));
	}
	const isPasswordMatched = await user.comparePassword(password);
	if (!isPasswordMatched) {
		return next(new ErrorHandler("Invalid Email Or Password.", 400));
	}
	if (user.role !== role) {
		return next(
			new ErrorHandler(
				`User with provided email and ${role} not found!`,
				404
			)
		);
	}
	sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
	res.status(201)
		.cookie("token", "", {
			httpOnly: true,
			expires: new Date(Date.now()),
		})
		.json({
			success: true,
			message: "Logged Out Successfully.",
		});
});

export const getUser = catchAsyncErrors((req, res, next) => {
	const user = req.user;
	res.status(200).json({
		success: true,
		user,
	});
});
