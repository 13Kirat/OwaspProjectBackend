import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please provide a title."],
		minLength: [3, "Title must contain at least 3 Characters!"],
		maxLength: [30, "Title cannot exceed 30 Characters!"],
	},
	category: {
		type: String,
		required: [true, "Please provide a category."],
		enum: ["Hackthon", "Speaker Session"],
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
	prize: {
		type: String,
	},
	onDate: {
		type: String,
	},
	fromDate: {
		type: String,
	},
	toDate: {
		type: String,
	},
	description: {
		type: String,
		required: [true, "Please provide description."],
		minLength: [30, "Description must contain at least 30 Characters!"],
		maxLength: [500, "Description cannot exceed 500 Characters!"],
	},
	// on edit
	ended: {
		type: Boolean,
		default: false,
	},
	// provided
	eventPostedOn: {
		type: Date,
		default: Date.now,
	},
	postedBy: {
		type: mongoose.Schema.ObjectId,
		ref: "Organizer",
		required: true,
	},
	// image: {
	// 	public_id: {
	// 		type: String,
	// 		required: true,
	// 	},
	// 	url: {
	// 		type: String,
	// 		required: true,
	// 	},
	// },
});

export const Event = mongoose.model("Event", eventSchema);
