import NextAuth from "next-auth";
import { authOptions } from "./options";

// create handler for authentication
const handler = NextAuth(authOptions);

// export handler as GET and POST
export { handler as GET, handler as POST };
