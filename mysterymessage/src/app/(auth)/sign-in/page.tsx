"use client";

// import required modules
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/schemas/signInSchema";

// define SignInForm component
export default function SignInForm() {
	// define required hooks
	const router = useRouter();
	const { toast } = useToast();

	// Initialize the form with zod validation schema and default values
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	// handle form submission
	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		// sign in using next-auth signIn function
		const result = await signIn("credentials", {
			redirect: false,
			identifier: data.identifier,
			password: data.password,
		});
		console.log("result: ", result);

		// handle errors
		if (result?.error) {
			if (result.error === "CredentialsSignin") {
				toast({
					title: "Login Failed",
					description: "Incorrect username or password",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			}
		}

		// show success toast
		toast({
			title: "Success",
			description: "Login successful!\nRedirecting to dashboard...",
		});

		// redirect to dashboard on successful login
		if (result?.url) {
			router.replace("/dashboard");
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Welcome Back to Mystery Message
					</h1>
					<p className="mb-4">
						Sign in to continue your secret conversations
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="identifier"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email or Username</FormLabel>
									<Input {...field} />
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
									<Input type="password" {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" type="submit">
							Sign In
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Not a member yet?{" "}
						<Link
							href="/sign-up"
							className="text-blue-600 hover:text-blue-800"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
