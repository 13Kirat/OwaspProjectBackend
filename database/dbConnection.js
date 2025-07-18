import mongoose from "mongoose";

export const dbConnection = async () => {
	await mongoose
		.connect(process.env.MONGO_URI, {
			dbName: "OwaspProject",
		})
		.then(() => {
			console.log("Connected to database.");
		})
		.catch((err) => {
			console.log(`Some Error occured. ${err}`);
		});
};
