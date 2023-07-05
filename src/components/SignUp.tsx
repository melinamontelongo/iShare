import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

export default function SignUp() {
    return <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
            <h2 className="sm:text-4xl text-xl font-bold">iShare</h2>
            <h1 className="text-2-xl font-semibold tracking-tight">Sign Up</h1>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-zinc-700">Already have an account at iShare?{' '}
            <Link href="/sign-in" className="hover:text-zinc-800 text-sm underline underline-offset-4">Sign In</Link>
            </p>
        </div>
    </div>
}