"use client"

import { useToast } from "@/hooks/use-toast";
import { UserCredentials, UserValidator } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export default function SignUpCredentials() {
    const router = useRouter();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserCredentials>({
        resolver: zodResolver(UserValidator),
    })
    const { mutate: signUp, isLoading } = useMutation({
        mutationFn: async ({ email, password }: UserCredentials) => {
            const payload: UserCredentials = { email, password }
            const { data } = await axios.post(`/api/auth/credentials`, payload)
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "That email has already been registered",
                        variant: "destructive"
                    })
                }
            }
            return toast({
                title: "There was an error",
                description: "Could not register.",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            toast({
                title: "Successfully signed up!",
                description: "You can now sign in",
            });
            router.push("/sign-in");
        }
    })
    return (
        <form onSubmit={handleSubmit((e) => signUp(e))} className="flex flex-col gap-5">
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
            <Button isLoading={isLoading} loadingColor={"#18181b"} type="submit" className="w-full bg-teal-500 dark:bg-teal-600">Sign In</Button>
        </form>

    )
}