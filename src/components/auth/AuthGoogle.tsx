"use client"
import { useState } from "react"
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/navigation";

export default function AuthGoogle() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            await signIn("google");
            toast({ title: "Successfully logged in!" });
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
                {isLoading ? <Ring
                    size={20}
                    lineWeight={5}
                    speed={2}
                    color="#18181b"
                />
                    :
                    <><FcGoogle /> <span className="text-zinc-100 dark:text-zinc-900">Google</span></>
                }
            </button>
        </div>
    )
}