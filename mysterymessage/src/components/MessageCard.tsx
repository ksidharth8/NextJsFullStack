"use client";

// import required modules
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

// define MessageCardProps interface
type MessageCardProps = {
	message: Message;
	onMessageDelete: (messageId: string) => void;
};

// define MessageCard component
export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
	// define required hooks
	const { toast } = useToast();

	// define handleDeleteConfirm function
	const handleDeleteConfirm = async () => {
		try {
			// send DELETE request to /api/delete-message/:messageId
			const response = await axios.delete<ApiResponse>(
				`/api/delete-message/${message._id}`
			);
			toast({
				title: response.data.message,
			});

			// check if message._id is string
			if (typeof message._id === "string") {
				// call onMessageDelete function
				onMessageDelete(message._id);
			}
		} catch (error) {
			// return error response if delete fails and show error toast
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ?? "Failed to delete message",
				variant: "destructive",
			});
		}
	};

	// return MessageCard component
	return (
		<Card className="card-bordered">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>{message.content}</CardTitle>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								<X className="w-5 h-5" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently
									delete this message.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDeleteConfirm}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
				<div
					className="text-sm" // e.g. "Sep 1, 2021 12:00 PM"
				>
					{dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
				</div>
			</CardHeader>
			<CardContent></CardContent>
		</Card>
	);
}
