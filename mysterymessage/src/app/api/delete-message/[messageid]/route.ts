// import required dependencies
import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// define DELETE function
export async function DELETE(
	request: Request,
	{ params }: { params: { messageid: string } }
) {
	const messageId = params.messageid; // get messageid from params

	// connect to database
	await dbConnect();

	// get session from authOptions and user from session
	const session = await getServerSession(authOptions);
	const _user = session?.user as User | undefined;

	// return error response if session or user is null
	if (!session || !_user) {
		return Response.json(
			{ success: false, message: "Not authenticated" },
			{ status: 401 }
		);
	}

	try {
		// update user messages by removing message with messageId
		const updateResult = await UserModel.updateOne(
			{ _id: _user._id },
			{ $pull: { messages: { _id: messageId } } }
		);

		// return error response if message not found or already deleted
		if (updateResult.modifiedCount === 0) {
			return Response.json(
				{ message: "Message not found or already deleted", success: false },
				{ status: 404 }
			);
		}

		// return success response
		return Response.json(
			{ message: "Message deleted", success: true },
			{ status: 200 }
		);
	} catch (error) {
		// return error response if error deleting message
		console.error("Error deleting message:", error);
		return Response.json(
			{ message: "Error deleting message", success: false },
			{ status: 500 }
		);
	}
}
