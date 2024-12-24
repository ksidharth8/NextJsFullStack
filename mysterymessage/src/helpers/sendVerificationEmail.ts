// import required modules
import { resend } from "@/lib/resend";
import VerificationEmail from "@/../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// define the sendVerificationEmail function and export it
export async function sendVerificationEmail(
	email: string,
	username: string,
	otp: string
): Promise<ApiResponse> {
	try {
		// send the verification email
		const { data, error } = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>", //  sender email
			to: email, // email of the user
			subject: "Mystery Message Verification Code",
			react: VerificationEmail({ username, otp }), // call the VerificationEmail component with the username,otp
		});

		return {
			success: true,
			message: "Verification email sent",
		};
	} catch (error) {
		console.error("Error sending verification email", error);
		return {
			success: false,
			message: "Error sending verification email",
		};
	}
}
