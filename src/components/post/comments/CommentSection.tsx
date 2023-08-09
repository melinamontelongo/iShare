import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentSectionProps {
    postId: string,
}

export default async function CommentSection({ postId }: CommentSectionProps) {

    const session = await getAuthSession();

    const comments = await prisma.comment.findMany({
        where: {
            postId,
            //  Top comment
            replyToId: null,
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true,
                },
            },
        },
    })

    return (
        <div className="flex flex-col gap-y-4 mt-4">
            <hr className="border border-zinc-200 dark:border-zinc-800 w-full h-px my-6" />

            <CreateComment postId={postId} />

            <div className="flex flex-col gap-y-6 mt-4">
                {comments.filter((comment) => !comment.replyToId).map((topLevelComment) => {
                    const topLevelCommentvotesAmount = topLevelComment.votes.reduce((acc, vote) => {
                        if (vote.type === "UP") return acc + 1;
                        if (vote.type === "DOWN") return acc - 1;
                        return acc;
                    }, 0)
                    //  User has voted
                    const topLevelCommentVote = topLevelComment.votes.find((vote) => vote.userId === session?.user.id)

                    return (
                        /* TOP LEVEL COMMENT */
                        <div key={topLevelComment.id} className="flex flex-col">
                            <div className="mb-2">
                                <PostComment postId={postId}
                                    comment={topLevelComment}
                                    votesAmount={topLevelCommentvotesAmount}
                                    currentVote={topLevelCommentVote}
                                />
                            </div>

                            {/* REPLIES */}
                            {topLevelComment.replies.sort((a, b) => b.votes.length - a.votes.length) //sorted by popularity
                                .map((reply) => {
                                    const replyVotesAmount = reply.votes.reduce((acc, vote) => {
                                        if (vote.type === "UP") return acc + 1;
                                        if (vote.type === "DOWN") return acc - 1;
                                        return acc;
                                    }, 0)
                                    //  User has voted
                                    const replyVote = reply.votes.find((vote) => vote.userId === session?.user.id)

                                    return <div key={reply.id} className="ml-2 py-2 pl-4 border-l-2 border-zinc-200">
                                        <PostComment
                                            comment={reply}
                                            currentVote={replyVote}
                                            votesAmount={replyVotesAmount}
                                            postId={postId}
                                        />
                                    </div>
                                })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}