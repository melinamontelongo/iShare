"use client"

import { useState } from "react";
import { Label } from "../../ui/Label";
import { Textarea } from "../../ui/Textarea";
import { Button } from "../../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import useCustomToast from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import {useRouter} from "next/navigation";


interface CreateCommentProps {
    postId: string,
    replyToId?: string
}

export default function CreateComment({postId, replyToId}:CreateCommentProps){

    const [input, setInput] = useState<string>("")
    const {loginToast} = useCustomToast();
    const router = useRouter()
    const {mutate: comment, isLoading} = useMutation({
        mutationFn: async({postId, text, replyToId}: CommentRequest) => {
            const payload: CommentRequest = {
                postId, text, replyToId
            }
            const {data} = await axios.patch(`/api/community/post/comment`, payload)
            return data;
        },
        onError: (e) => {
            if(e instanceof AxiosError){
                if(e.response?.status === 401){
                    return loginToast()
                }
            }
            return toast({
                title: "There was a problem",
                description: "Something went wrong, please try again.",
                variant: "destructive",
            })
        },
        onSuccess: () => {
            router.refresh();
            setInput("");
        }
    })
    return <div className="grid w-full gap-1.5">
       <Label htmlFor="comment">Your comment</Label>
       <div className="mt-2">
        <Textarea 
        className="border border-zinc-200 dark:border-zinc-800 placeholder:text-zinc-600 placeholder:dark:text-zinc-500 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-600"
        id="comment" 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        rows={1}
        placeholder="What are your thoughts?"
        />
        <div className="mt-2 flex justify-end">
            <Button className="bg-zinc-900 dark:bg-zinc-50 hover:dark:bg-zinc-300 hover:bg-zinc-800" isLoading={isLoading} disabled={input.length === 0} onClick={() => comment({postId, text: input, replyToId})}>Post</Button>
        </div>
       </div>
    </div>
}