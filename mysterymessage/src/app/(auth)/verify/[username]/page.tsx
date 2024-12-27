"use client";

// import required modules
import { Button } from "@/components/ui/button";
import {Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter, useParams } from "next/navigation";
import {  useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccount = () => {
	// define required hooks
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const { toast } = useToast();

	// zod implementation
	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	});

	// define onSubmit function
	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		try {
			if (!params) {
				throw new Error("Params is null");
			}
			// send POST request to /api/verify-code
			const response = await axios.post("/api/verify-code", {
				username: params.username,
				code: data.code,
			});

			// show success toast
			toast({
				title: "Success",
				description: response.data.message,
			});

			// redirect to sign in page
			router.replace("/sign-in");
		} catch (error) {
			// return error response if verify fails and show error toast
			console.log("Error signing up", error);
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage =
				axiosError.response?.data.message ?? "Error signing up";
			toast({
				title: "Verify error",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Verify Your Account
					</h1>
					<p className="mb-4">
						Enter the verification code sent to your email
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="code"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>
										<Input {...field} placeholder="code" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Verify</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default VerifyAccount;
