import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log("Already connected to MongoDB");
		return;
	}

	try {
		const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
		console.log("db: ", db);
		console.log("db.connections: ", db.connections);
		connection.isConnected = db.connections[0].readyState;
		console.log("Connection to MongoDB established");
	} catch (error) {
		console.error("Error connecting to MongoDB", error);
		process.exit(1);
	}
}

export default dbConnect;
