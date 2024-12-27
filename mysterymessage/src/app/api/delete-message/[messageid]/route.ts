import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function DELETE(
	request: Request,
	{ params }: { params: { messageid: string } }
) {
	// Ensure `messageid` is available in `params`
	const { messageid: messageId } = params;

	// Connect to the database
	await dbConnect();

	// Get session from authOptions
	const session = await getServerSession(authOptions);
	const _user = session?.user as User | undefined;

	// Return error response if session or user is null
	if (!session || !_user) {
		return NextResponse.json(
			{ success: false, message: "Not authenticated" },
			{ status: 401 }
		);
	}

	try {
		// Update user messages by removing the message with the provided `messageId`
		const updateResult = await UserModel.updateOne(
			{ _id: _user._id },
			{ $pull: { messages: { _id: messageId } } }
		);

		// Return error response if message not found or already deleted
		if (updateResult.modifiedCount === 0) {
			return NextResponse.json(
				{ message: "Message not found or already deleted", success: false },
				{ status: 404 }
			);
		}

		// Return success response
		return NextResponse.json(
			{ message: "Message deleted", success: true },
			{ status: 200 }
		);
	} catch (error) {
		// Return error response if there was an issue deleting the message
		console.error("Error deleting message:", error);
		return NextResponse.json(
			{ message: "Error deleting message", success: false },
			{ status: 500 }
		);
	}
}
