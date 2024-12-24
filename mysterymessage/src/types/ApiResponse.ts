// import Message
import { Message } from "@/model/User";

// ApiResponse interface with success, message, isAcceptingMessages, and messages properties
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;  // optional property
    messages?: Array<Message>;  // optional property
}