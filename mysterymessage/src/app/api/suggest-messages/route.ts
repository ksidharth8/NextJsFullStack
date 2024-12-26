import { streamText } from "ai";
import { google as googleSDK } from "@ai-sdk/google";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
	GoogleGenerativeAI,
	GoogleGenerativeAIResponseError,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

// const google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

// const generationConfig = {
// 	maxTokens: 100,
// 	temperature: 0.5,
// 	topP: 1,
// 	frequencyPenalty: 0,
// 	presencePenalty: 0,
// 	stop: ["\n", "Human:"],
// };

// const model = google.getGenerativeModel({
// 	model: "gemini-1.5-pro-latest",
// 	generationConfig,
// });

// export async function POST(request: NextRequest) {
// 	const { messages } = await request.json();
// 	const prompt = messages[messages.length - 1].content;
// 	const result = await model.generateContent(prompt);
// 	return NextResponse.json(result.response.text(), { status: 200 });
// }

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_API_KEY as string,
});

const model = google("gemini-1.5-pro-latest");

export const runtime = "edge";

export async function POST(req: Request) {
	try {
		const result = streamText({
			model: model,
			maxTokens: 400,
			prompt:
				"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
		});

		// example: use textStream as an async iterable
		let text = "";
		for await (const textPart of result.textStream) {
			text += textPart;
		}

		return text;
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
