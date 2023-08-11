import Link from "next/link";
import AuthGoogle from "./AuthGoogle";
import SignUpCredentials from "./SignUpCredentials";
import Image from "next/image";
export default function SignUp() {
    return (
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <Image src="/ishare_logo.png" alt="ishare logo" height={150} width={150} style={{ margin: "auto" }} />
                <h1 className="text-xl font-semibold tracking-tight">Join us!</h1>
            </div>
            <SignUpCredentials />
            <p className="text-xs text-center">Or continue with</p>
            <AuthGoogle />
            <p className="px-8 text-center text-sm text-zinc-700">Already have an account at iShare?{' '}
                <Link href="/sign-in" className="hover:text-zinc-800 text-sm underline underline-offset-4">Sign In</Link>
            </p>
        </div>
    )
}