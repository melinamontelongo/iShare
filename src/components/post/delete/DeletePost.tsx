"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MoreVertical, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface DeletePostProps {
    postId: string,
    communityName: string,
};

export default function DeletePost({ postId, communityName }: DeletePostProps) {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/community/post/delete?id=${postId}`);
            return data;
        },
        onError: () => {
            return toast({
                title: "Something went wrong",
                description: "Your post was not deleted, please try again later",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            toast({
                title: "Success!",
                description: "Your post has been deleted."
            })
            //  If it's post view, navigate back to community 
            if(pathname.includes("/post")) return router.replace(`/i/${communityName}`);
            
            //  Infinite query's initial data is repopulated again (show fresh data)
            queryClient.invalidateQueries({queryKey: ["postsInfiniteQuery"]});
            router.refresh();
        }
    })
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreVertical className="h-4 w-4 mr-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800" align="end">
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <div className="flex items-center" onClick={() => mutate()}><Trash className="h-4 w-4 mr-1" /> Delete Post</div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}