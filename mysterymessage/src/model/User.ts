// import required modules
import { Schema, model, models, Model, Document } from "mongoose";

// define the interface for the Message
export interface Message extends Document {
	content: string;
	createdAt: Date;
}

// define the schema for the Message
const messageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

// define the interface for the User
export interface User extends Document {
	username: string;
	email: string;
	password: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isVerified: boolean;
	isAcceptingMessages: boolean;
	messages: Message[];
}

// define the schema for the User
const emailRegex = /.+\@.+\..+/;
const userSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		match: [emailRegex, "Invalid email address"],
	},
	password: { type: String, required: [true, "Password is required"] },
	verifyCode: { type: String, required: [true, "Verify code is required"] },
	verifyCodeExpiry: {
		type: Date,
		required: [true, "Verify code expiry is required"],
	},
	isVerified: { type: Boolean, default: false },
	isAcceptingMessages: { type: Boolean, default: true },
	messages: [messageSchema],
});

// define the models for the User and Message
const UserModel =
	(models.User as Model<User>) || model<User>("User", userSchema);

// export the models
export default UserModel;
