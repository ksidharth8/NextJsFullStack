// import mongoose
import mongoose from "mongoose";

// Define ConnectionObject type
type ConnectionObject = {
	isConnected?: number;
};

// Create connection object
const connection: ConnectionObject = {};

// Create dbConnect function
async function dbConnect(): Promise<void> {
    // Check if connection is already established
	if (connection.isConnected) {
		console.log("Already connected to MongoDB");
		return;
	}

	try {
        // Connect to MongoDB
		const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
		// console.log("db: ", db);
		// console.log("db.connections: ", db.connections);
		connection.isConnected = db.connections[0].readyState;
		console.log("Connection to MongoDB established");
	} catch (error) {
        // Log error and exit process
		console.error("Error connecting to MongoDB", error);
		process.exit(1);
	}
}

// Export dbConnect function
export default dbConnect;
