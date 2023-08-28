"use client"

import useCustomToast from "@/hooks/use-custom-toast"
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client"
import { useEffect, useState } from "react";
import { Button } from "../../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface PostVoteClientProps {
    postId: string,
    initialVotesAmount: number,
    initialVote?: VoteType | null
}
export default function PostVoteClient({ postId, initialVotesAmount, initialVote }: PostVoteClientProps) {
    const { loginToast } = useCustomToast();
    const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const previousVote = usePrevious(currentVote);

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])

    const { mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: PostVoteRequest = {
                postId,
                voteType,
            }
            await axios.patch("/api/community/post/vote", payload)
        },
        onError: (err, voteType) => {
            if (voteType === "UP") setVotesAmount((prev => prev - 1));
            else setVotesAmount((prev) => prev + 1);
            //  reset current vote as it failed
            setCurrentVote(previousVote)
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }
            return toast({
                title: "Something went wrong",
                description: "Your vote was not registered, please try again",
                variant: "destructive"
            })
        },
        onMutate: (type: VoteType) => {
            //  If vote is same as before
            if (currentVote === type) {
                setCurrentVote(undefined);
                if (type === "UP") setVotesAmount((prev) => prev - 1);
                else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
            } else {
                // If vote is not the same as before
                setCurrentVote(type);
                if(type === "UP") setVotesAmount((prev) => prev + 1);
                else if(type === "DOWN") setVotesAmount((prev) => prev - 1);
            }
        }
    })

    return (
        <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
            <Button onClick={() => vote("UP")}
                size="sm" variant="ghost" aria-label="upvote" className="hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <ArrowBigUp className={cn("h-5 w-5 text-zinc-700", {
                    "text-emerald-500 fill-emerald-500": currentVote === "UP"
                })} />
            </Button>

            <p className="text-center py-2 font-medium text-sm">{votesAmount}</p>

            <Button onClick={() => vote("DOWN")} size="sm" variant="ghost" aria-label="downvote" className="hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <ArrowBigDown className={cn("h-5 w-5 text-zinc-700", {
                    "text-red-500 fill-red-500": currentVote === "DOWN"
                })} />
            </Button>
        </div>)

}