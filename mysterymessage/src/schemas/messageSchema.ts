// import z
import { z } from "zod";

// messageSchema to validate the content of a message
export const messageSchema = z.object({
	content: z
		.string()
		.min(1, "Message must not be empty")
		.max(300, "Message must be at most 300 characters long"),
});
