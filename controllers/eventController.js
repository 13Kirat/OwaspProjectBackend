import ErrorHandler from "../middlewares/error.js";
import { Event } from "../models/eventSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

export const getAllEvents = catchAsyncErrors(async (req, res, next) => {
	const events = await Event.find({ ended: false });
	res.status(200).json({
		success: true,
		events,
	});
});

export const postEvent = catchAsyncErrors(async (req, res, next) => {
	const { role } = req.user;
	if (role === "Job Seeker" || role === "Employer") {
		return next(
			new ErrorHandler(
				"Job Seeker and Employer not allowed to access this resource.",
				400
			)
		);
	}

	if (!req.files || Object.keys(req.files).length === 0) {
		return next(new ErrorHandler("Image of Event is Required!", 400));
	}

	const { image } = req.files;

	const allowedFormats = [
		"image/png",
		"image/jpeg",
		"image/jpg",
		"image/webp",
	];

	if (!allowedFormats.includes(resume.mimetype)) {
		return next(
			new ErrorHandler(
				"Invalid file type. Please upload a PNG file.",
				400
			)
		);
	}

	const cloudinaryResponse = await cloudinary.uploader.upload(
		image.tempFilePath
	);

	if (!cloudinaryResponse || cloudinaryResponse.error) {
		console.error(
			"Cloudinary Error: ",
			cloudinaryResponse.error || "Unknown Cloudinary error"
		);
		return next(
			new ErrorHandler("Failed to upload Event Image to Cloudinary", 500)
		);
	}

	const {
		title,
		description,
		category,
		onDate,
		fromDate,
		toDate,
		modeOf,
		location,
		pricePool,
	} = req.body;

	if (!title || !description || !category || !modeOf || !location || !image) {
		return next(
			new ErrorHandler("Please provide full event details.", 400)
		);
	}

	if (!onDate && (!fromDate || !toDate)) {
		return next(
			new ErrorHandler(
				"Please either provide event Date or ranged Dates.",
				400
			)
		);
	}

	if (onDate && fromDate && toDate) {
		return next(
			new ErrorHandler(
				"Cannot Enter Fixed Date and Ranged Dates together.",
				400
			)
		);
	}

	const postedBy = req.user._id;

	const event = await Event.create({
		title,
		description,
		category,
		onDate,
		fromDate,
		toDate,
		modeOf,
		location,
		pricePool,
		postedBy,
		image: {
			public_id: cloudinaryResponse.public_id,
			url: cloudinaryResponse.secure_url,
		},
	});

	res.status(200).json({
		success: true,
		message: "Event Created Successfully!",
		event,
	});
});

export const getMyEvents = catchAsyncErrors(async (req, res, next) => {
	const { role } = req.user;

	if (role === "Job Seeker" || role === "Employer") {
		return next(
			new ErrorHandler(
				"Job Seeker and Employer not allowed to access this resource.",
				400
			)
		);
	}

	const myEvents = await Event.find({ postedBy: req.user._id });
	res.status(200).json({
		success: true,
		myEvents,
	});
});

export const updateEvent = catchAsyncErrors(async (req, res, next) => {
	const { role } = req.user;

	if (role === "Job Seeker" || role === "Employer") {
		return next(
			new ErrorHandler(
				"Job Seeker and Employer not allowed to access this resource.",
				400
			)
		);
	}

	const { id } = req.params;

	let event = await Event.findById(id);

	if (!event) {
		return next(new ErrorHandler("OOPS! Event not found.", 404));
	}

	event = await Event.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});
	res.status(200).json({
		success: true,
		message: "Job Updated!",
	});
});

export const deleteEvent = catchAsyncErrors(async (req, res, next) => {
	const { role } = req.user;

	if (role === "Job Seeker" || role === "Employer") {
		return next(
			new ErrorHandler(
				"Job Seeker and Employer not allowed to access this resource.",
				400
			)
		);
	}

	const { id } = req.params;

	const event = await Event.findById(id);

	if (!event) {
		return next(new ErrorHandler("OOPS! Event not found.", 404));
	}

	await event.deleteOne();

	res.status(200).json({
		success: true,
		message: "Event Deleted!",
	});
});

export const getSingleEvent = catchAsyncErrors(async (req, res, next) => {
	const { id } = req.params;

	try {
		const event = await Event.findById(id);
		if (!event) {
			return next(new ErrorHandler("Event not found.", 404));
		}
		res.status(200).json({
			success: true,
			event,
		});
	} catch (error) {
		return next(new ErrorHandler(`Invalid ID / CastError`, 404));
	}
});
