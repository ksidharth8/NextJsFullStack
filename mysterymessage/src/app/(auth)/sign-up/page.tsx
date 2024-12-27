"use client";

// import required modules
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// define Page component
const Page = () => {
	// define local state variables
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// define debounced function to check username uniqueness after 300ms of typing
	const debounced = useDebounceCallback(setUsername, 300); // useDebounceCallback creates a debounced function (function called after some time)

	// define required hooks
	const { toast } = useToast();
	const router = useRouter();

	// zod implementation
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	// useEffect to check username uniqueness after typing
	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage("");
				try {
					// check username uniqueness using axios GET request to /api/check-username-unique
					const response = await axios.get(
						`/api/check-username-unique?username=${username}`
					);
					console.log("response: ", response);
					const message = response.data.message;
					setUsernameMessage(message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ?? "Error checking username"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		checkUsernameUnique();
	}, [username]);

	// onSubmit function to sign up user
	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		console.log("data: ", data);
		setIsSubmitting(true);
		try {
			// sign up user using axios POST request to /api/sign-up
			const response = await axios.post<ApiResponse>("/api/sign-up", data);
			toast({
				title: "success",
				description: response.data.message,
			});
			// redirect to /verify/username page
			router.replace(`/verify/${username}`);
		} catch (error) {
			// return error response if sign up fails
			console.log("Error signing up", error);
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage =
				axiosError.response?.data.message ?? "Error signing up";
			toast({
				title: "Sign up error",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		// return sign up form
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join Mystery Message
					</h1>
					<p className="mb-4">
						Sign up to start your secret conversations
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="username"
											{...field}
											onChange={(e) => {
												// onChange event to set username and call debounced function
												field.onChange(e);
												debounced(e.target.value);
											}}
										/>
									</FormControl>
									{isCheckingUsername && ( // show loader while checking username
										<Loader2 className="animate-spin" />
									)}
									{!isCheckingUsername &&
										usernameMessage && ( // show username message after checking
											<p
												className={`text-sm ${
													usernameMessage === "Username is unique"
														? "text-green-500"
														: "text-red-500"
												}`}
											>
												{usernameMessage}
											</p>
										)}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							className="w-full"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? ( // show loader while submitting
								<>
									<Loader2 className="mr-2 w-4 h-4 animate-spin" />
									Please wait...
								</>
							) : (
								"Sign Up"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Already a member?{" "}
						<Link
							href="/sign-in" // link to sign in page
							className="text-blue-600 hover:text-blue-800"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Page;
