import Link from "next/link";
import ThemeChanger from "./ThemeChanger";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import Searchbar from "./Searchbar";

export default async function Navbar() {
    const session = await getAuthSession();
    return (<>
        <header className="bg-white dark:bg-black z-50">
            <div className="mx-auto flex h-16 max-w-screen items-center gap-8 px-4 sm:px-6 lg:px-8 z-50">
                <Link className="block text-teal-600" href="/">
                    <span className="sr-only">Home</span>
                    <h2 className="sm:text-4xl text-xl font-bold">iShare</h2>
                </Link>

                <Searchbar />

                <div className="flex flex-1 items-center justify-end md:justify-between">
                    <div className="flex items-center sm:gap-4 gap-2">
                        <div className="block rounded-md md:px-5 md:py-2.5 px-3 py-2 text-sm font-medium transition">
                            <ThemeChanger />
                        </div>
                        <div className="sm:flex sm:gap-4">
                            {session ? (
                                <UserAccountNav user={session.user}/>
                            )
                                :
                                (
                                    <Link
                                        className="block rounded-md bg-teal-600 md:px-5 md:py-2.5 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                                        href="/sign-in">
                                        Sign In
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </>
    )
}