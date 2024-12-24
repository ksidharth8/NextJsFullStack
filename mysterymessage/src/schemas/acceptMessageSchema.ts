// import z
import {z} from "zod";

// acceptMessageSchema to validate the acceptMessage field
export const acceptMessageSchema = z.object({
    acceptMessage: z.boolean(),
})