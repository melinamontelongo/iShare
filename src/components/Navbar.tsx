import Link from "next/link";
import ThemeChanger from "./ThemeChanger";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import Searchbar from "./Searchbar";

export default async function Navbar() {
    const session = await getAuthSession();
    return (<> 
        <header className="bg-zinc-50 dark:bg-zinc-950 h-fit shadow-sm fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link className="block text-teal-500 dark:text-teal-600" href="/">
                        <span className="sr-only">Home</span>
                        <h2 className="md:text-4xl text-xl font-bold sm:block hidden">iShare</h2>
                        <h2 className="sm:hidden text-4xl font-bold">iS</h2>
                    </Link>

                    <Searchbar />
                </div>
                <div className="flex items-center gap-2">
                    <div className="block rounded-md md:px-5 md:py-2.5 px-3 py-2 text-sm font-medium transition">
                        <ThemeChanger />
                    </div>
                    <div className="sm:flex sm:gap-2">
                        {session ? (
                            <UserAccountNav user={session.user} />
                        )
                            :
                            (
                                <Link
                                    className="block rounded-md bg-teal-500 dark:bg-teal-600 md:px-5 md:py-2.5 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                                    href="/sign-in">
                                    Sign In
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    </>
    )
}