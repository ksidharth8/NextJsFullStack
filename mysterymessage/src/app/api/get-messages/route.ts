// import required modules
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

// define GET function
export async function GET(request: Request): Promise<Response> {
	// connect to database
	await dbConnect();

	// get session from server side using auth options and user from session
	const session = await getServerSession(authOptions);
	const user: User = session?.user as User; // Assertion to User type

	// check if user exists
	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "Not authenticated",
			},
			{ status: 401 }
		);
	}

	// get user id from session user object
	const userId = new mongoose.Types.ObjectId(user._id); // Convert user._id to ObjectId as it is stored as string in session

	try {
		// fetch messages for user
		const existingUser = await UserModel.aggregate([
			{ $match: { _id: userId } }, // $match: Filters documents to only include those with an _id matching userId.

			{ $unwind: "$messages" }, // $unwind: Deconstructs the messages array field from the input documents to output a document for each element.

			{ $sort: { "messages.createdAt": -1 } }, // $sort: Sorts the documents by the createdAt field of the messages in descending order.

			{ $group: { _id: "$_id", messages: { $push: "$messages" } } }, // $group: Groups the documents back by _id and reassembles the messages array, now sorted by createdAt.

			// The result is a user document with their messages sorted by creation date in descending order. (array of messages)
		]);

		// check if user exists and has messages
		if (!existingUser || existingUser.length === 0) {
			return Response.json(
				{
					success: false,
					message: "No messages found for user",
				},
				{ status: 404 }
			);
		}

		// return success response with messages
		return Response.json(
			{
				success: true,
				message: "Messages fetched successfully",
				messages: existingUser[0].messages,
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Error getting messages",
				error: error,
			},
			{ status: 500 }
		);
	}
}
