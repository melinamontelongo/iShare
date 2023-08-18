"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommentDropdownProps {
    commentId: string,
}
const CommentDropdown = ({ commentId }: CommentDropdownProps) => {
    const router = useRouter();

    const { mutate: deleteComment } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/community/post/comment?id=${commentId}`);
            return data;
        },
        onError: (e) => {
            console.log(e)
            return toast({
                title: "Something went wrong.",
                description: "Comment was not deleted, please try again.",
                variant: "destructive",
            });
        },
        onSuccess: () => {
            toast({
                title: "Success!",
                description: "Comment deleted.",
            });
            router.refresh();
        }
    });
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreVertical className="h-4 w-4 mr-1"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800" align="end">
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <div className="flex items-center" onClick={() => deleteComment()}><Trash className="h-4 w-4 mr-1" /> Delete comment</div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CommentDropdown;