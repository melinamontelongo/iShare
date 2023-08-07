import Link from "next/link";
import SignIn from "@/components/auth/SignIn";
import { ChevronLeft } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
    const session = await getAuthSession();
    if(session?.user) redirect("/");
    return (
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center">
                <Link href="/" className="self-start flex gap-2"><ChevronLeft /> Go back</Link>
                <SignIn />
            </div>
        </div>
    )
}