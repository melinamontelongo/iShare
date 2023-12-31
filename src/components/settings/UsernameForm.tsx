"use client"
import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"
interface UsernameFormProps {
    user: Pick<User, "id" | "username">
}

export default function UsernameForm({ user }: UsernameFormProps) {
    const router = useRouter()
    const { handleSubmit, register, formState: { errors } } = useForm<UsernameRequest>({
        resolver: zodResolver(UsernameValidator),
        defaultValues: {
            name: user?.username || ""
        }
    })

    const { mutate: updateUsername, isLoading } = useMutation({
        mutationFn: async ({ name }: UsernameRequest) => {
            const payload: UsernameRequest = { name }
            const { data } = await axios.patch(`/api/profile/username`, payload)
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Username already taken",
                        description: "Please choose a different username.",
                        variant: "destructive"
                    })
                }
            }
            return toast({
                title: "There was an error",
                description: "Could not change username.",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            toast({
                description: "Your username has been updated."
            })
            router.refresh();
        }
    })


    return (
        <form onSubmit={handleSubmit((e) => updateUsername(e))}>
            <Card className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Your username</CardTitle>
                    <CardDescription className="text-zinc-400 dark:text-zinc-600">
                        Please enter a display name you are comfortable with.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative grid gap-1">
                        <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                            <span className="text-sm">u/</span>
                        </div>
                        <Label className="sr-only" htmlFor="name">Name</Label>
                        <Input id="name" className="sm:w-[400px] w-full bg-zinc-100 dark:bg-zinc-900 pl-6 border border-zinc-200 dark:border-zinc-800 placeholder:text-zinc-600 placeholder:dark:text-zinc-500 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-600" size={32} {...register("name")} />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button isLoading={isLoading} className="bg-zinc-900 dark:bg-zinc-50 hover:dark:bg-zinc-300 hover:bg-zinc-800">Change name</Button>
                </CardFooter>
            </Card>
        </form>
    )
}