"use client"
import { useToast } from "@/hooks/use-toast";
import { UserCredentials, UserValidator } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "./ui/Button";

export default function SignInCredentials() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>();
    const { toast } = useToast();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<UserCredentials>({
        resolver: zodResolver(UserValidator),
    })

    const loginWithCredentials = async (credentials: FieldValues) => {
        setIsLoading(true);
        //  Next auth manages sign in (no redirect on error)
        const res = await signIn("credentials", { ...credentials, redirect: false, callbackUrl: `${window.location.origin}/` });
        //  If url is null there was an error
        if (!res?.url) {
            setIsLoading(false);
            toast({
                title: "There was an error",
                description: `${res?.error}`,
                variant: "destructive"
            })
            //  No error
        } else {
            toast({ title: "Successfully logged in!" });
            router.push("/")
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(loginWithCredentials)} className="flex flex-col gap-5">
            <div>
                <Label>Email</Label>
                <Input className="bg-zinc-100 dark:bg-zinc-900 placeholder:text-zinc-600 placeholder:dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 focus-visible:ring-teal-600 dark:focus-visible:ring-teal-500"
                    type="text" {...register("email")} />
            </div>
            <div>
                <Label>Password</Label>
                <Input className="bg-zinc-100 dark:bg-zinc-900 placeholder:text-zinc-600 placeholder:dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 focus-visible:ring-teal-600 dark:focus-visible:ring-teal-500"
                    type="password" {...register("password")} />
            </div>
            <Button isLoading={isLoading} loadingColor={"#18181b"} type="submit" className="w-full bg-teal-500 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-700 ">Sign In</Button>
        </form>
    )
}