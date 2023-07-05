import Link from "next/link";
import SignIn from "@/components/SignIn";

export default function SignInPage() {
    return (
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
                <Link href="/" className="self-start ">Go back</Link>
                <SignIn />
            </div>
        </div>
    )
}