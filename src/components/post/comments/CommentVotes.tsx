"use client"

import useCustomToast from "@/hooks/use-custom-toast"
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client"
import {  useState } from "react";
import { Button } from "../../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CommentVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

type PartialVote = Pick<CommentVote, "type">

interface CommentVotesProps {
    commentId: string,
    initialVotesAmount: number,
    initialVote?: PartialVote
}

export default function CommentVotes({ commentId, initialVotesAmount, initialVote }: CommentVotesProps) {
    const { loginToast } = useCustomToast();
    const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
    const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(initialVote);
    const previousVote = usePrevious(currentVote);

    const { mutate: vote } = useMutation({
        mutationFn: async (type:VoteType) => {
            const payload: CommentVoteRequest = {
                commentId,
                voteType: type,
            }
            await axios.patch("/api/community/post/comment/vote", payload)
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
            if (currentVote?.type === type) {
                //  remove vote
                setCurrentVote(undefined);
                if (type === "UP") setVotesAmount((prev) => prev - 1);
                else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
            } else {
                // If vote is not the same as before
                setCurrentVote({type});
                //  subtract 2
                if(type === "UP") setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
                else if(type === "DOWN") setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
            }
        }
    })

    return (
        <div className="flex gap-1">
            <Button onClick={() => vote("UP")}
                size="sm" variant="ghost" aria-label="upvote" className="hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <ArrowBigUp className={cn("h-5 w-5 text-zinc-700", {
                    "text-emerald-500 fill-emerald-500": currentVote?.type === "UP"
                })} />
            </Button>

            <p className="text-center py-2 font-medium text-sm">{votesAmount}</p>

            <Button onClick={() => vote("DOWN")} size="sm" variant="ghost" aria-label="downvote" className="hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <ArrowBigDown className={cn("h-5 w-5 text-zinc-700", {
                    "text-red-500 fill-red-500": currentVote?.type === "DOWN"
                })} />
            </Button>
        </div>)

}