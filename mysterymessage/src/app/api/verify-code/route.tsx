// import required modules
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// define POST function
export async function POST(request: Request): Promise<Response> {
	// connect to database
	await dbConnect();
	try {
		// get username and code from request body
		const { username, code } = await request.json();

		// decode the username (remove special characters like %20)
		const decodedUsername = decodeURIComponent(username);

		// check for existing user with username and verified status
		const existingUser = await UserModel.findOne({ decodedUsername });

		// return error response if user not found
		if (!existingUser) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 400 }
			);
		}

		// check if the code is correct
		const isCodeCorrect = existingUser.verifyCode === code;

		// check if the code is not expired
		const isCodeNotExpired =
			new Date(existingUser.verifyCodeExpiry) > new Date();

        // return error response if code is incorrect or expired
        if (!isCodeCorrect || !isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid code, please try again",
                },
                { status: 400 }
            );
        }

        // update user verification status
        existingUser.isVerified = true;
        await existingUser.save();

		// return success response
		return Response.json(
			{
				success: true,
				message: "Account verified successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		// return error response
		console.error("Error verifying user", error);
		return Response.json(
			{ success: false, message: "Error verifying user" },
			{ status: 500 }
		);
	}
}
