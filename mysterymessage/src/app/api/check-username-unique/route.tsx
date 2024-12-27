// import required modules
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// define username query schema for validation in GET request (frontend mae while typing)
const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

// define GET function
export async function GET(request: Request): Promise<Response> {
	// connect to database
	await dbConnect();
	try {
		// get searchParams from request URL
		const searchParam = new URL(request.url).searchParams;	// e.g. /api/check-username-unique?username=abc

		// get username from searchParams
		const queryParam = { username: searchParam.get("username") };	// e.g. { username: "abc" }

		// validate the username query with zod
		const result = UsernameQuerySchema.safeParse(queryParam);	// e.g. { success: true, data: { username: "abc" } }

		// return error response if username is invalid
		if (!result.success) {
			const usernameErrors = result.error.format().username?._errors || [];
			return Response.json(
				{
					success: false,
					// return error message having username errors (like min, max, regex)
					message: usernameErrors?.length
						? usernameErrors.join(",")
						: "Invalid username format",
				},
				{ status: 400 }
			);
		}

		// check for existing user with username
		const { username } = result.data;
		const existingVerifiedUser = await UserModel.findOne({
			username,
			isVerified: true,
		});

		// return error response if username is not unique
		if (existingVerifiedUser) {
			return Response.json(
				{
					success: false,
					message: "Username already exists",
				},
				{ status: 400 }
			);
		}

		// return success response if username is unique
		return Response.json(
			{ success: true, message: "Username is unique" },
			{ status: 200 }
		);
	} catch (error) {
		// return error response if username is not unique
		console.error("Error checking username uniqueness", error);
		return Response.json(
			{ success: false, message: "Error checking username uniqueness" },
			{ status: 500 }
		);
	}
}
