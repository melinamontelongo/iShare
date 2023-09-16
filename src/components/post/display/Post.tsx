"use client"
import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { useRef } from "react";
import EditorOutput from "../create/EditorOutput";
import PostVoteClient from "../post-vote/PostVoteClient";
import DeletePost from "../delete/DeletePost";
import { useSession } from "next-auth/react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { usePathname, useRouter } from "next/navigation";

type PartialVote = Pick<Vote, "type">

interface PostProps {
    communityName: string,
    post: Post & {
        author: Pick<User, "name" | "username" | "image" | "email">,
        votes: Vote[]
    },
    commentAmount: number,
    votesAmount: number,
    currentVote?: PartialVote,
}

export default function Post({ communityName, post, commentAmount, votesAmount, currentVote }: PostProps) {
    const postRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const session = useSession();
    const pathname = usePathname();

    return (<>
        <div className="rounded-md shadow hover:bg-zinc-200 dark:hover:bg-zinc-800 group p-4">
            <div className="px-6 flex justify-between">
                <PostVoteClient
                    postId={post.id}
                    initialVotesAmount={votesAmount}
                    initialVote={currentVote?.type} />

                <div className="w-0 flex-1">
                    <div className="flex justify-between">
                        <div>
                            <div className="max-h-40 mt-1 text-xs flex items-center">
                                <div className="flex items-center gap-2">
                                    <UserAvatar user={post.author} />
                                    <p className="flex gap-2">
                                        <span className="font-bold text-zinc-700 dark:text-zinc-300">u/{post.author.username} </span>
                                        ·
                                        <span className="text-zinc-600 dark:text-zinc-500">{formatTimeToNow(new Date(post.createdAt))}</span>
                                    </p>
                                </div>

                                {communityName && !pathname.includes(communityName) && (
                                    <><p className="ml-2 text-zinc-700 dark:text-zinc-300">
                                        ·
                                        <span> on </span>
                                        <a className="hover:underline font-bold" href={`/i/${communityName}`}>
                                            i/{communityName}
                                        </a>
                                    </p>
                                    </>
                                )}
                            </div>

                            <h1 className="text-lg font-semibold py-2 leading-6 cursor-pointer" onClick={() => router.push(`/i/${communityName}/post/${post.id}`)}>
                                {post.title}
                            </h1>
                        </div>
                        {session.data?.user.id === post.authorId && (
                            <div>
                                <DeletePost postId={post.id} communityName={communityName} />
                            </div>
                        )}
                    </div>
                    {/* dinamically trace height */}
                    <div className="relative text-sm max-h-40 w-full overflow-clip" ref={postRef}>

                        <EditorOutput content={post.content} />

                        {postRef.current?.clientHeight === 160 ? (
                            /* apply gradient if exceeding height */
                            <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-900 group-hover:from-zinc-200 dark:group-hover:from-zinc-800"></div>
                        ) : null
                        }
                    </div>
                </div>
            </div>

            <div className="z-20 text-sm p-4 sm:px-6">
                <a className="w-fit flex items-center gap-2" href={`/i/${communityName}/post/${post.id}`}>
                    <MessageSquare className="h-4 w-4" /> {commentAmount > 0 ?
                        `${commentAmount} ${commentAmount === 1 ? "comment" : "comments"}` 
                        : 
                        "No comments"
                        }
                </a>
            </div>
        </div></>)
}