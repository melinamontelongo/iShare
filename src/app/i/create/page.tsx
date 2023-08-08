"use client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { CreateCommunityPayload } from "@/lib/validators/community"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import useCustomToast from "@/hooks/use-custom-toast"


export default function Create() {
    const [input, setInput] = useState<string>("")
    const router = useRouter()
    const {loginToast} = useCustomToast()
    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: CreateCommunityPayload = {
                name: input,
            }
            const { data } = await axios.post("/api/community", payload)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 409){
                    return toast({
                        title:"Community already exists",
                        description: "Please choose a different name.",
                        variant: "destructive"
                    })
                }
                if(err.response?.status === 422){
                    return toast({
                        title:"Invalid community name",
                        description: "Please choose a name between 3 and 21 characters.",
                        variant: "destructive"
                    })
                }
                if(err.response?.status === 401){
                    return loginToast()
                }
            }
            toast({
                title: "There was an error",
                description: "Could not create community.",
                variant: "destructive"
            })
        },
        onSuccess: (data) => {
            //  Redirect to link with community name
            router.push(`/i/${data}`)
        }
    })

    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative w-full h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Create a community</h1>
                </div>
                <hr className="border border-zinc-200 dark:border-zinc-800 h-px" />

                <div>
                    <p className="text-lg font-medium">Name</p>
                    <p className="text-xs pb-2">Community names including capitalization cannot be changed.</p>
                    <div className="relative">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                            i/
                        </p>
                        <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6 bg-zinc-100 dark:bg-zinc-900 pl-6 border border-zinc-200 dark:border-zinc-800 placeholder:text-zinc-600 placeholder:dark:text-zinc-500 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-600" />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-200 dark:hover:bg-zinc-800">Cancel</Button>
                    <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => createCommunity()} className="hover:dark:bg-zinc-200 hover:bg-zinc-800">Create community</Button>
                </div>
            </div>
        </div>
    )
}