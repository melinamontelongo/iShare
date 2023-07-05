import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote"
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { commentId, voteType } = CommentVoteValidator.parse(body);
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }

        const existingVote = await prisma.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId,
            },
        })
        //  Already existing vote
        if (existingVote) {
            if (existingVote.type === voteType) {
                await prisma.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    }
                })
                return new Response("OK");
            } else {
                await prisma.commentVote.update({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    },
                    data: {
                        type: voteType,
                    }
                })
                return new Response("OK");
            }
        }

        // No existing vote
        await prisma.commentVote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                commentId,
            }
        })
        return new Response("OK");

    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed", { status: 422 })
        }
        return new Response("Could not register your vote, please try again later.", { status: 500 })
    }
}