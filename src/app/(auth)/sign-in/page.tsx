import Link from "next/link";
import SignIn from "@/components/auth/SignIn";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export default async function SignInPage() {
    return (
        <div className="absolute inset-0 mt-24">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-10">
                <Link className={buttonVariants({ variant:"ghost", className:"hover:bg-zinc-200 dark:hover:bg-zinc-800 self-start" })} href="/"><ChevronLeft className='h-4 w-4 mr-1' /> Go back</Link>
                <SignIn />
            </div>
        </div>
    )
}