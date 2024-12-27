"use client";

// import required modules
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
// import { useCompletion } from "ai/react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

// define parseStringMessages function
const parseStringMessages = (messageString: string): string[] => {
	return messageString.split("||");
};

// define initial message string
const initialMessageString =
	"What's your favorite movie?||Do you have any pets?||What's your dream job?";

// define SendMessage component
export default function SendMessage() {
	// define required hooks
	const params = useParams<{ username: string }>();
	// const {complete,completion,isLoading: isSuggestLoading,error} = useCompletion({api: "/api/suggest-messages",initialCompletion: initialMessageString,});

	// define required states
	const username = params?.username ?? "";
	const [suggestedMessages, setSuggestedMessages] =
		useState(initialMessageString);

	// define form
	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
	});

	// define required functions
	const messageContent = form.watch("content");

	// define handleMessageClick function
	const handleMessageClick = (message: string) => {
		form.setValue("content", message);
	};

	// define isLoading state
	const [isLoading, setIsLoading] = useState(false);

	// define onSubmit function
	const onSubmit = async (data: z.infer<typeof messageSchema>) => {
		setIsLoading(true);
		try {
			// send POST request to /api/send-message
			const response = await axios.post<ApiResponse>("/api/send-message", {
				...data,
				username,
			});

			// show success toast
			toast({
				title: response.data.message,
				variant: "default",
			});

			// reset form after submission
			form.reset({ ...form.getValues(), content: "" });
		} catch (error) {
			// return error response if send fails and show error toast
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ?? "Failed to sent message",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// define fetchSuggestedMessages function
	const fetchSuggestedMessages = async () => {
		try {
			// fetch suggested messages using useCompletion hook
			// 		complete("");

			// fetch suggested messages using axios and set suggested messages
			const response = await axios.get("/api/suggest-messages");
			setSuggestedMessages(response.data.suggestedMessages);
		} catch (error) {
			console.error("Error fetching messages:", error);
			// Handle error appropriately
		}
	};

	// return JSX component
	return (
		<div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
			<h1 className="text-4xl font-bold mb-6 text-center">
				Public Profile Link
			</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Send Anonymous Message to @{username}
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Write your anonymous message here"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-center">
						{isLoading ? (
							<Button disabled>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</Button>
						) : (
							<Button
								type="submit"
								disabled={isLoading || !messageContent}
							>
								Send It
							</Button>
						)}
					</div>
				</form>
			</Form>

			<div className="space-y-4 my-8">
				<div className="space-y-2">
					<Button
						onClick={fetchSuggestedMessages}
						className="my-4"
						// disabled={isSuggestLoading}
					>
						Suggest Messages
					</Button>
					<p>Click on any message below to select it.</p>
				</div>
				<Card>
					<CardHeader>
						<h3 className="text-xl font-semibold">Messages</h3>
					</CardHeader>
					<CardContent className="flex flex-col space-y-4">
						{/* {Error ? ( */}
						{false ? ( // remove Error condition (TODO)
							<p className="text-red-500">{Error.toString()}</p>
						) : (
							parseStringMessages(
								// completion
								suggestedMessages
							).map((message, index) => (
								<Button
									key={index}
									variant="outline"
									className="mb-2"
									onClick={() => handleMessageClick(message)}
								>
									{message}
								</Button>
							))
						)}
					</CardContent>
				</Card>
			</div>
			<Separator className="my-6" />
			<div className="text-center">
				<div className="mb-4">Get Your Message Board</div>
				<Link href={"/sign-up"}>
					<Button>Create Your Account</Button>
				</Link>
			</div>
		</div>
	);
}
