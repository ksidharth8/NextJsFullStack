// This file is used to extend the User object with additional fields that are not present in the default User object.
import "next-auth";
import { DefaultSession } from "next-auth";

// extend User and Session objects with additional fields
declare module "next-auth" {
	interface User {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessages?: boolean;
		username?: string;
	}

	interface Session {
		user: {
			_id?: string;
			isVerified?: boolean;
			isAcceptingMessages?: boolean;
			username?: string;
		} & DefaultSession["user"]; // DefaultSession["user"] is the default User object
	}
}

// extend JWT object with additional fields
declare module "next-auth/jwt" {
	interface JWT {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessages?: boolean;
		username?: string;
	}
}
