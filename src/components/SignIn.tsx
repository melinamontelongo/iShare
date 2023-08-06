import Link from "next/link";
import UserAuthForm from "./UserAuthForm";
import SignInCredentials from "./SignInCredentials";

export default function SignIn() {
    return (
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <h2 className="sm:text-4xl text-xl font-bold text-teal-500 dark:text-teal-600">iShare</h2>
                <h1 className="text-2-xl font-semibold tracking-tight">Welcome back!</h1>
            </div>
            <SignInCredentials />
            <p className="text-xs text-center">Or continue with</p>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-zinc-700">New to iShare?{' '}
                <Link href="/sign-up" className="hover:text-zinc-800 text-sm underline underline-offset-4">Sign Up</Link>
            </p>
        </div>
    )
}