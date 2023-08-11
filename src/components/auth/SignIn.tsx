import Link from "next/link";
import AuthGoogle from "./AuthGoogle";
import SignInCredentials from "./SignInCredentials";
import Image from "next/image";

export default function SignIn() {
    return (
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <Image src="/ishare_logo.png" alt="ishare logo" height={150} width={150} style={{ margin: "auto" }} />
                <h1 className="text-xl font-semibold tracking-tight">Welcome back!</h1>
            </div>
            <SignInCredentials />
            <p className="text-xs text-center">Or continue with</p>
            <AuthGoogle />
            <p className="px-8 text-center text-sm text-zinc-700">New to iShare?{' '}
                <Link href="/sign-up" className="hover:text-zinc-800 text-sm underline underline-offset-4">Sign Up</Link>
            </p>
        </div>
    )
}