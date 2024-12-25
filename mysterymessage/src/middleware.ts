// import required modules
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware"; // authentication for your entire site (if only default export)
import { getToken } from "next-auth/jwt";

// Middleware to check if the user is authenticated
export async function middleware(request: NextRequest) {
	// Get the token from the request
	const token = await getToken({ req: request });

	// fetch url from request.nextUrl
	const url = request.nextUrl;

	// If the user is authenticated, redirect to the dashboard instead of the sign-in, sign-up, verify, or home page
	if (
		token &&
		(url.pathname.startsWith("/sign-in") ||
			url.pathname.startsWith("/sign-up") ||
			url.pathname.startsWith("/verify") ||
			url.pathname.startsWith("/"))
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// If the user is not authenticated, redirect to the sign-in page instead of the dashboard
	if (!token && url.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

    // return next response
    return NextResponse.next();
}

// mathcer for secure certain pages and if not authenticated redirect to sign-in page
export const config = {
	matcher: [
		"/sign-in",
		"/sign-up",
		"/",
		"/dashboard/:path*",
		"/verify/:path*",
	],
};
