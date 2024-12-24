// import required modules
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// define POST function
export async function POST(request: Request): Promise<Response> {
	// connect to database
	await dbConnect();
	try {
		// get email, username, and password from request body
		const { email, username, password } = await request.json();

		// check for existing user with username and verified status
		const existingUserVerifiedByUsername = await UserModel.findOne({
			username,
			isVerified: true,
		});
		if (existingUserVerifiedByUsername) {
			return Response.json(
				{
					success: false,
					message: "Username already exists",
				},
				{ status: 400 }
			);
		}

		// generate verification code
		const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generate a 6-digit random number

		// check for existing user with email
		const existingUserByEmail = await UserModel.findOne({ email });
		if (existingUserByEmail) {
			// check if user is already verified
			if (existingUserByEmail.isVerified) {
				// return error response as email already exists
				return Response.json(
					{
						success: false,
						message: "Email already exists",
					},
					{ status: 400 }
				);
			} else {
				// user exists but is not verified, so update the user
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = otp;
				existingUserByEmail.verifyCodeExpiry = new Date(
					Date.now() + 60 * 60 * 1000
				); // set expiry date to 1 hour from now
				await existingUserByEmail.save();
				// This will now jump to line 80 and send the verification email
			}
		} else {
			// hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// set verification code expiry date
			const expiryDate = new Date(); // create new date object for expiry date so that we can set it to 1 hour from now
			expiryDate.setHours(expiryDate.getHours() + 1); // set expiry date to 1 hour from now

			// create new user
			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode: otp,
				verifyCodeExpire: expiryDate,
				isVerified: false,
				isAcceptingMessages: true,
				messages: [],
			});

			// save new user to database
			await newUser.save();
		}
        
		// send verification email
		const emailResponse = await sendVerificationEmail(email, username, otp);

		// check if sending email was successful
		if (!emailResponse.success) {
			return Response.json(
				{
					success: false,
					message:
						"Error sending verification email " + emailResponse.message,
				},
				{ status: 500 }
			);
		}

		// return success response
		return Response.json(
			{
				success: true,
				message: "User registered successfully. Please verify your email.",
			},
			{ status: 200 }
		);
	} catch (error) {
		// log error and return error response
		console.error("Error registering user", error);
		return Response.json(
			{
				success: false,
				message: "Error registering user",
			},
			{ status: 500 }
		);
	}
}
