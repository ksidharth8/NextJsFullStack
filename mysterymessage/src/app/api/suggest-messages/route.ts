// import required dependencies
import {
	GoogleGenerativeAI,
	GoogleGenerativeAIResponseError,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

// defive generative AI model and configuration
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY as string);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-pro-latest",
	generationConfig: {
		candidateCount: 1,
		maxOutputTokens: 50,
		temperature: 1.5,
	},
});
export const runtime = "edge";	// define runtime

// define GET function
export async function GET(req: Request) {
	try {
		// define prompt
		const prompt =
			"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

		// generate content
		const result = await model.generateContent(prompt);

		console.log(
			"result.response.usageMetadata: ",
			result.response.usageMetadata
		);

		// extract response
		const response =
			result.response.candidates &&
			result.response.candidates[0]?.content.parts[0]?.text?.toString();

		// sample response
		// const response =
		// 	"What's something you're learning or want to learn?||If you could travel anywhere in the world right now, where would you go and why?||What's a small act of kindness that you've either given or received that";

		console.log("content from route.ts: ", response);

		// return response as JSON
		return Response.json(
			{
				success: true,
				suggestedMessages: response,
			},
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof GoogleGenerativeAIResponseError) {
			// Google API error handling
			const { name, message, stack } = error;
			return NextResponse.json(
				{ name, message },
				{ status: 500, headers: { "Content-Type": "application/json" } }
			);
		} else {
			// General error handling
			console.error("An unexpected error occurred:", error);
			throw error;
		}
	}
}
