import { formatTimeToNow } from "@/lib/utils"
import { Post, User, Vote } from "@prisma/client"
import { MessageSquare } from "lucide-react"
import { useRef } from "react"
import EditorOutput from "../create/EditorOutput"
import PostVoteClient from "../post-vote/PostVoteClient"
import DeletePost from "../delete/DeletePost"
import { useSession } from "next-auth/react"

type PartialVote = Pick<Vote, "type">

interface PostProps {
    communityName: string,
    post: Post & {
        author: User,
        votes: Vote[]
    },
    commentAmount: number,
    votesAmount: number,
    currentVote?: PartialVote,
}

export default function Post({ communityName, post, commentAmount, votesAmount, currentVote }: PostProps) {
    const postRef = useRef<HTMLDivElement>(null)
    const session = useSession();

    return (
        <div className="rounded-md shadow">
            <div className="px-6 flex justify-between">
                <PostVoteClient
                    postId={post.id}
                    initialVotesAmount={votesAmount}
                    initialVote={currentVote?.type} />

                <div className="w-0 flex-1">
                    <div className="flex justify-between">
                        <div>
                            <div className="max-h-40 mt-1 text-xs">
                                {communityName ? (
                                    <>{/* anchor to force hard reload */}
                                        <a className="underline text-sm underline-offset-2" href={`/i/${communityName}`}>
                                            i/{communityName}
                                        </a>
                                        <span className="px-1">-</span>
                                    </>
                                )
                                    : null}
                                <span>Posted by u/{post.author.username}</span>{" "}
                                {formatTimeToNow(new Date(post.createdAt))}
                            </div>

                            <a href={`/i/${communityName}/post/${post.id}`}>
                                <h1 className="text-lg font-semibold py-2 leading-6">
                                    {post.title}
                                </h1>
                            </a>
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
                            <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-900"></div>
                        ) : null
                        }
                    </div>
                </div>
            </div>

            <div className="z-20 text-sm p-4 sm:px-6">
                <a className="w-fit flex items-center gap-2" href={`/i/${communityName}/post/${post.id}`}>
                    <MessageSquare className="h-4 w-4" /> {commentAmount} comments
                </a>
            </div>
        </div>)
}