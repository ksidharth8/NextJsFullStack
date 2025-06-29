// import z
import { z } from "zod";

// usernameValidation to validate the username field
export const usernameValidation = z
	.string()
	.min(3, "Username must be at least 3 characters long")
	.max(20, "Username must be at most 20 characters long")
	.regex(
		/^[a-zA-Z0-9_]+$/,
		"Username must not contain any special characters"
	);

// signUpSchema to validate the username, email, and password fields
export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});
