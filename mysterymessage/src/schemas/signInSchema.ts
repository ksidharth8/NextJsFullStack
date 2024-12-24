// import z
import {z} from "zod"

// signInSchema to validate the identifier and password fields
export const signInSchema = z.object({
    identifier: z.string(),
    password: z.string(),
})