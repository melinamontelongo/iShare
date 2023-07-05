"use client"
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { CommunitySubscriptionPayload } from "@/lib/validators/community";
import axios, { AxiosError } from "axios";
import useCustomToast from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
    communityId: string,
    communityName: string,
    isSubscribed: boolean,
}
export default function SubscribeLeaveToggle({communityId, communityName, isSubscribed}:SubscribeLeaveToggleProps){
    const {loginToast} = useCustomToast()
    const router = useRouter()

    const {mutate: subscribe, isLoading: isSubscribing} = useMutation({
        mutationFn: async() => {
            const payload:CommunitySubscriptionPayload = {
                communityId,
            }
            const {data} = await axios.post("/api/community/subscribe", payload)
            return data as string;
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
            // Reload without losing state
            startTransition(() => {
                router.refresh()
            })
            return toast({
                title: "Subscribed",
                description: `You are now subscribed to ${communityName}`
            })
        }   
    })

    const {mutate: unsubscribe, isLoading: isUnsubscribing} = useMutation({
        mutationFn: async() => {
            const payload:CommunitySubscriptionPayload = {
                communityId,
            }
            const {data} = await axios.post("/api/community/unsubscribe", payload)
            return data as string;
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
            // Reload without losing state
            startTransition(() => {
                router.refresh()
            })
            return toast({
                title: "Unsubscribed",
                description: `You are now unsubscribed to ${communityName}`
            })
        }   
    })
    
    return isSubscribed ? 
    (
        <Button className="w-full mt-1 mb-4" onClick={() => unsubscribe()} isLoading={isUnsubscribing}>Leave community</Button>
    ) 
    :
    (
        <Button className="w-full mt-1 mb-4" onClick={() => subscribe()} isLoading={isSubscribing}>Join to post</Button>
    )

}