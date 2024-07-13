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

	console.log(req.body);

	if (role === "Employer" || role === "Student") {
		return next(
			new ErrorHandler(
				"Job Seeker and Employer not allowed to access this resource." +
					role,
				400
			)
		);
	}

	// if (!req.files || Object.keys(req.files).length === 0) {
	// 	return next(new ErrorHandler("Image of Event is Required!", 400));
	// }

	// const { image } = req.files;

	// const allowedFormats = [
	// 	"image/png",
	// 	"image/jpeg",
	// 	"image/jpg",
	// 	"image/webp",
	// ];

	// if (!allowedFormats.includes(resume.mimetype)) {
	// 	return next(
	// 		new ErrorHandler(
	// 			"Invalid file type. Please upload a PNG file.",
	// 			400
	// 		)
	// 	);
	// }

	// const cloudinaryResponse = await cloudinary.uploader.upload(
	// 	image.tempFilePath
	// );

	// if (!cloudinaryResponse || cloudinaryResponse.error) {
	// 	console.error(
	// 		"Cloudinary Error: ",
	// 		cloudinaryResponse.error || "Unknown Cloudinary error"
	// 	);
	// 	return next(
	// 		new ErrorHandler("Failed to upload Event Image to Cloudinary", 500)
	// 	);
	// }

	const {
		title,
		category,
		modeOf,
		location,
		pricePool,
		prize,
		eventDate,
		onDate,
		fromDate,
		toDate,
		description,
	} = req.body;

	if (
		!title ||
		!category ||
		!modeOf ||
		!location ||
		!prize ||
		!eventDate ||
		!description
	) {
		return next(
			new ErrorHandler("Please provide full event details.", 400)
		);
	}

	if (eventDate === "Fixed Date") {
		if (!onDate) {
			return next(
				new ErrorHandler("Enter Fixed Date of the Event.", 400)
			);
		}
	}

	if (eventDate === "Ranged Date") {
		if (!fromDate && !toDate) {
			return next(
				new ErrorHandler("Enter Ranged Dates of the Event.", 400)
			);
		}
	}

	if (onDate && fromDate && toDate) {
		return next(
			new ErrorHandler(
				"Cannot Enter Fixed Date and Ranged Dates together.",
				400
			)
		);
	}

	if (category === "Hcakthon") {
		if (!pricePool) {
			return next(
				new ErrorHandler("Please provide the Prize Pool Value.", 400)
			);
		}
	}

	const postedBy = req.user._id;

	const event = await Event.create({
		title,
		category,
		modeOf,
		location,
		pricePool,
		prize,
		eventDate,
		onDate,
		fromDate,
		toDate,
		description,
		postedBy,
		// image: {
		// 	public_id: cloudinaryResponse.public_id,
		// 	url: cloudinaryResponse.secure_url,
		// },
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
