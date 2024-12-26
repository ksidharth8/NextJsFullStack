import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

// POST function
export async function POST(request: Request): Promise<Response> {
	// connect to database
	await dbConnect();

	// get username and content from request body
	const { username, content } = await request.json();

	try {
		// fetch user by username
		const user = await UserModel.findOne({ username });

		// check if user exists
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		// check if user is accepting messages
		if (!user.isAcceptingMessages) {
			return Response.json(
				{
					success: false,
					message: "User is not accepting messages",
				},
				{ status: 403 }
			);
		}

		// create new message
		const newMessage = {
			content,
			createdAt: new Date(),
		};

		// update user with new message
		// const updatedUser = await UserModel.findByIdAndUpdate(
		// 	user._id,
		// 	{ $push: { messages: newMessage } },
		// 	{ new: true }
		// );
		user.messages.push(newMessage as Message); // Assertion to Message type
		const updatedUser = await user.save();

		// return success response
		return Response.json(
			{
				success: true,
				message: "Message sent successfully",
                messages: user.messages,
				user: updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		// return error response
        console.log("Error sending message", error);
		return Response.json(
			{
				success: false,
				message: "Error sending message",
			},
			{ status: 500 }
		);
	}
}
