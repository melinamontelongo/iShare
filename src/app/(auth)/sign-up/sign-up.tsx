import Link from "next/link";
import SignUp from "@/components/SignUp";

export default function SignUpPage() {
    return (
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
                <Link href="/" className="self-start ">Go back</Link>
                <SignUp />
            </div>
        </div>
    )
}