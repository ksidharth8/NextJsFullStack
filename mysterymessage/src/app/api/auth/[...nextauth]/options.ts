// import required modules
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// define auth options
export const authOptions: NextAuthOptions = {
	// configure providers for authentication
	providers: [
		CredentialsProvider({
			// define credentials provider
			id: "credentials",
			name: "Credentials",
			// define credentials with email and password
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			// define authorize function
			async authorize(credentials: any): Promise<any> {
				// connect to database
				await dbConnect();
				try {
					// // get email and password from credentials and use them accordingly
					// const { username, password } = credentials;

					// check for user with email
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});

					// check if user exists
					if (!user) {
						throw new Error("User not found");
					}

					// check if user is verified
					if (!user.isVerified) {
						throw new Error(
							"User not verified, please verify your email"
						);
					}

					// check if password matches
					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);
					// if password is correct, return user
					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Password incorrect");
					}
				} catch (error) {}
			},
		}),
	],

	// configure callbacks for JWT and session
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				// set token fields
				token._id = user.id?.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				// set session fields
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
				session.user.username = token.username;
			}
			return session;
		},
	},

	// define pages for redirection
	pages: {
		signIn: "sign-in",
	},

	// define session options
	session: {
		strategy: "jwt",
	},

	// define secret
	secret: process.env.NEXTAUTH_SECRET,
};
