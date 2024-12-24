// import { Resend } 
import { Resend } from "resend";

// create a new instance of the Resend class with the API key and export it
export const resend = new Resend(process.env.RESEND_API_KEY);