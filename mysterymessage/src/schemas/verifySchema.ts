// import z
import { z } from "zod";

// verifySchema to validate the code(otp) field
export const verifySchema = z.object({
    code: z.string().length(6, "Verification code must be 6 characters long"),
});