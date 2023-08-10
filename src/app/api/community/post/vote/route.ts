import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/validators/redis";
import { PostVoteValidator } from "@/lib/validators/vote"
import { CachedPost } from "@/types/redis";
import { z } from "zod";
//  Cache posts with high engagement
const CACHE_AFTER_UPVOTES = 25;

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { postId, voteType } = PostVoteValidator.parse(body);
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }

        const existingVote = await prisma.vote.findFirst({
            where: {
                userId: session.user.id,
                postId,
            },
        })

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                author: true,
                votes: true,
                community: true,
            }
        })
        if (!post) {
            return new Response("Post not found", { status: 404 })
        }

        //  Already existing vote
        if (existingVote) {
            //  if already upvoted or downvoted
            if (existingVote.type === voteType) {
                await prisma.vote.delete({
                    where: {
                        userId_postId: {
                            postId,
                            userId: session.user.id
                        }
                    }
                })
                return new Response("OK");
            }
            await prisma.vote.update({
                where: {
                    userId_postId: {
                        postId,
                        userId: session.user.id
                    }
                },
                data: {
                    type: voteType,
                }
            })
            //  Recount votes
            const votesAmount = post.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc
            }, 0)
            //  Cache popular posts
            if (votesAmount >= CACHE_AFTER_UPVOTES) {
                const cachePayload: CachedPost = {
                    authorId: post.authorId,
                    authorUsername: post.author.username ?? "",
                    communityName: post.community.name,
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    createdAt: post.createdAt,
                }
                await redis.hset(`post:${postId}`, cachePayload);
            }
            return new Response("OK");
        }

        // No existing vote
        await prisma.vote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                postId,
            }
        })
        //  Recount votes
        const votesAmount = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc
        }, 0)
        //  Cache popular posts
        if (votesAmount >= CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
                authorUsername: post.author.username ?? "",
                authorId: post.authorId,
                communityName: post.community.name,
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                createdAt: post.createdAt,
            }
            await redis.hset(`post:${postId}`, cachePayload);
        }
        return new Response("OK");
        
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed", { status: 422 })
        }
        return new Response("Could not register your vote, please try again later.", { status: 500 })
    }
}