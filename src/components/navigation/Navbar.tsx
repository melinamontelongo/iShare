import Link from "next/link";
import ThemeChanger from "../ui/ThemeChanger";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import Searchbar from "./Searchbar";
import Image from "next/image";

export default async function Navbar() {
    const session = await getAuthSession();
    return (<> 
        <header className="bg-zinc-50 dark:bg-zinc-950 h-fit shadow-sm fixed top-0 left-0 right-0 z-50 px-2 py-1">
            <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                    <a className="text-teal-500 dark:text-teal-600 sm:block hidden md:px-4 px-2 py-2" href="/">
                        <span className="sr-only">Home</span>
                        <Image src="/ishare_logo.png" alt="ishare logo" height={100} width={100} />
                    </a>
                    <a className="block text-teal-500 dark:text-teal-600 sm:hidden block" href="/">
                        <span className="sr-only">Home</span>
                        <Image src="/ishare_logo_sm.png" alt="ishare logo" height={50} width={50} />
                    </a>
                    <Searchbar />
                </div>
                <div className="flex items-center gap-2">
                    <div className="block rounded-md text-sm font-medium transition">
                        <ThemeChanger />
                    </div>
                    <div className="sm:flex">
                        {session ? (
                            <UserAccountNav user={session.user} />
                        )
                            :
                            (
                                <Link
                                    className="block rounded-md bg-teal-500 dark:bg-teal-600 md:px-5 md:py-2.5 p-1 md:text-sm text-xs font-medium text-white transition hover:bg-teal-700"
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