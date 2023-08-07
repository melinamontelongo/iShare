import Link from "next/link";
import SignUp from "@/components/auth/SignUp";
import { ChevronLeft } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-10">
                <Link href="/" className="self-start "><ChevronLeft /> Go back</Link>
                <SignUp />
            </div>
        </div>
    )
}