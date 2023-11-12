import CommentSection from "@/components/post/comments/CommentSection";
import EditorOutput from "@/components/post/create/EditorOutput";
import DeletePost from "@/components/post/delete/DeletePost";
import PostVoteServer from "@/components/post/post-vote/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTimeToNow } from "@/lib/utils";
import { redis } from "@/lib/validators/redis";
import { CachedPost } from "@/types/redis";
import { Post, Vote, User, Community } from "@prisma/client";
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
    const session = await getAuthSession();

    let cachedPost: CachedPost | null;
    let post: (Post & { votes: Vote[]; author: Pick<User, "id" | "username">; community: Community }) | null = null;
    try {
        //  Check if cached
        cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost;
    } catch (error) {
        console.error(error);
        cachedPost = null;
    }

    //  Only fetch db if no cached post or error was thrown when fetching cached post
    if (!cachedPost) {
        post = await prisma.post.findFirst({
            where: {
                id: params.postId,
            },
            include: {
                votes: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                community: true,
            }
        })
    }
    if (!post && !cachedPost) return notFound();
    return (
        <div>
            <div className="h-full flex flex-col items-center sm:items-start justify-between">
                <div className="flex sm:flex-row flex-col items-center">
                    <div className="order-2 sm:order-none sm:self-center self-start">
                        <Suspense fallback={<PostVoteSkeleton />}>
                            <PostVoteServer postId={(post?.id ?? cachedPost?.id)!} getData={async () => {
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
                    </div>
                    <div className="w-full flex-1 p-4 rounded-sm order-1 sm:order-none">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="max-h-40 mt-1 truncate text-sm">
                                    Posted by u/{post?.author.username ?? cachedPost?.authorUsername}{"  "}
                                    <span className="text-zinc-600 dark:text-zinc-500 text-xs">{formatTimeToNow(new Date((post?.createdAt ?? cachedPost?.createdAt)!))}</span>
                                </p>
                                <h1 className="text-xl font-semibold py-2 leading-6">
                                    {post?.title ?? cachedPost?.title}
                                </h1>
                            </div>

                            {session?.user.id === (post?.authorId ?? cachedPost?.authorId) && (
                                <div>
                                    <DeletePost postId={params.postId} communityName={(post?.community.name ?? cachedPost?.communityName)!} />
                                </div>
                            )}
                        </div>
                        <div>
                            <EditorOutput content={post?.content ?? cachedPost?.content} />
                        </div>
                    </div>
                </div>
                <div className="order-3 sm:order-none">
                    <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
                        <CommentSection postId={(post?.id ?? cachedPost?.id)!} />
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