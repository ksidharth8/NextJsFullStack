// import required modules
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

// define POST function
export async function POST(request: Request): Promise<Response> {
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

	// get user id from session user object and acceptMessages from request body
	const userId = user._id;
	const { acceptMessages } = await request.json();

	try {
		// update user with acceptMessages
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ isAcceptingMessages: acceptMessages },
			{ new: true }
		);

		// check if user exists
		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "User not updated",
				},
				{ status: 401 }
			);
		}

		// return success response
		return Response.json(
			{
				success: true,
				message: "User status to accept messages updated successfully",
				user: updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		// return error response
		console.log("Failed to update user status to accept messages", error);
		return Response.json(
			{
				success: false,
				message: "Failed to update user status to accept messages",
			},
			{ status: 500 }
		);
	}
}

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
	const userId = user._id;

	try {
		// get user by id
		const existingUser = await UserModel.findById(userId);

		// check if user exists
		if (!existingUser) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		// return success response
		return Response.json(
			{
				success: true,
				message: "User found and status to accept messages retrieved successfully",
				isAcceptingMessages: existingUser.isAcceptingMessages,
				existingUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		// return error response
		console.log("Failed to get user status to accept messages", error);
		return Response.json(
			{
				success: false,
				message: "Failed to get user status to accept messages",
			},
			{ status: 500 }
		);
	}
}
