"use client";

// import required modules
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@react-email/components";

// define Navbar component
const Navbar = () => {
	// define required hooks
	const { data: session } = useSession();

	// define user
	const user = session?.user as User;

	// return Navbar component
	return (
		<nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
				<a href="#" className="text-xl font-bold mb-4 md:mb-0">
					Mystery Message
				</a>
				{session ? (
					<>
						<span className="mr-4">
							Welcome, {user?.username || user?.email}
						</span>
						<Button
							onClick={() => signOut()}
							className="w-full md:w-auto bg-slate-100 text-black"
						>
							Logout
						</Button>
					</>
				) : (
					<Link href="/sign-in">
						<Button className="w-full rounded md:w-auto bg-slate-100 text-black">
							<div className="px-3">Login</div>
						</Button>
					</Link>
				)}
			</div>
		</nav>
	);
};

// export Navbar component
export default Navbar;
