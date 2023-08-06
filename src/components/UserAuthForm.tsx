"use client"
import { useState } from "react"
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";

export default function UserAuthForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast();

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            await signIn("google");
        } catch (error) {
            toast({
                title: "There was a problem.",
                description: "There was an error logging in with Google",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex justify-center">
            <button onClick={loginWithGoogle} className="w-full flex mx-auto bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 py-2 rounded-md justify-center items-center gap-4">
                {isLoading ? null : <FcGoogle />}
                <span className="text-zinc-100 dark:text-zinc-900">Google</span>
            </button>
        </div>
    )
}