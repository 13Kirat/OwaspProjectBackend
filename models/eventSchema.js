import mongoose from "mongoose";

const eventSchema = new  mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provide a title."],
			minLength: [3, "Title must contain at least 3 Characters!"],
			maxLength: [30, "Title cannot exceed 30 Characters!"],
		},
		description: {
			type: String,
			required: [true, "Please provide description."],
			minLength: [30, "Description must contain at least 30 Characters!"],
			maxLength: [500, "Description cannot exceed 500 Characters!"],
		},
		category: {
			type: String,
			required: [true, "Please provide a category."],
		},
		onDate: {
			type: Date,
		},
		fromDate: {
			type: Date,
		},
		toDate: {
			type: Date,
		},
		modeOf: {
			type: String,
			required: [true, "Enter Mode Of Event"],
			enum: ["Online", "Offline", "Hybrid"],
		},
		location: {
			type: String,
			minLength: [10, "Location must contian at least 10 characters!"],
		},
		pricePool: {
			type: Number,
		},
		ended: {
			type: Boolean,
			default: false,
		},
		eventPostedOn: {
			type: Date,
			default: Date.now,
		},
		postedBy: {
			type: mongoose.Schema.ObjectId,
			ref: "Organizer",
			required: true,
		},
		image: {
			public_id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
		},
	},
	{ bufferCommands: false }
);

export const Event = mongoose.model("Event", eventSchema);
