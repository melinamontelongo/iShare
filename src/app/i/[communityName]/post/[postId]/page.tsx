import CommentSection from "@/components/post/comments/CommentSection";
import EditorOutput from "@/components/post/create/EditorOutput";
import PostVoteServer from "@/components/post/post-vote/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { formatTimeToNow } from "@/lib/utils";
import { redis } from "@/lib/validators/redis";
import { CachedPost } from "@/types/redis";
import { Post, Vote, User } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from 'next/navigation';
import { Suspense } from "react";

interface PageProps {
    params: {
        postId: string
    }
}
//  To always get fresh data
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function PostDetails({ params }: PageProps) {
    //  Check if cached
    const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost

    let post: (Post & { votes: Vote[]; author: User }) | null = null
    //  Only fetch db if no cached post
    if (!cachedPost) {
        post = await prisma.post.findFirst({
            where: {
                id: params.postId,
            },
            include: {
                votes: true,
                author: true,
            }
        })
    }
    if (!post && !cachedPost) return notFound()
    return (
        <div>
            <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
                <Suspense fallback={<PostVoteSkeleton />}>
                    <PostVoteServer postId={post?.id ?? cachedPost.id} getData={async () => {
                        return await prisma.post.findUnique({
                            where: {
                                id: params.postId,
                            },
                            include: {
                                votes: true,
                            }
                        })
                    }} />
                </Suspense>
                <div className="sm:w-0 w-full flex-1 p-4 rounded-sm">
                    <p className="max-h-40 mt-1 truncate text-sm">
                        Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
                        {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                    </p>
                    <h1 className="text-xl font-semibold py-2 leading-6">
                        {post?.title ?? cachedPost.title}
                    </h1>
                    <EditorOutput content={post?.content ?? cachedPost.content} />
                   
                    <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
                        <CommentSection postId={post?.id ?? cachedPost.id} />
                    </Suspense>

                </div>
            </div>
        </div>
    )
}

function PostVoteSkeleton() {
    return <div className="flex items-center flex-col pr-6 w-20">
        <div className={buttonVariants({ variant: "ghost" })}>
            <ArrowBigUp className="h-5 w-5 text-zinc-500" />
        </div>
        <div className="text-center py-2 font-medium text-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
        </div>
        <div className={buttonVariants({ variant: "ghost" })}>
            <ArrowBigDown className="h-5 w-5 text-zinc-500" />
        </div>
    </div>
}