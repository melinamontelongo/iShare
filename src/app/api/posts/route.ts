import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ExtendedPost } from "@/types/extended-post";
import { Session } from "next-auth";
import { z } from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const session = await getAuthSession();

    let subscriptionsIds: string[] = [];

    if (session) {
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                community: true,
            }
        })
        subscriptionsIds = subscriptions.map(({ community }) => community.id);
    }
    try {
        const { communityName, limit, page } = z.object({
            limit: z.string(),
            page: z.string(),
            communityName: z.string().nullish().optional()
        }).parse({
            communityName: url.searchParams.get("communityName"),
            limit: url.searchParams.get("limit"),
            page: url.searchParams.get("page")
        });

        let whereClause: object | null = null;
        let posts: ExtendedPost[] = [];
        let postsCount: number = 0;

        //  If req comes from inside a community
        if (communityName) {
            whereClause = {
                community: {
                    name: communityName,
                },
            }
            //  If user is logged in: match communities the user is following
        } else if (session) {
            if (subscriptionsIds.length > 0) {
                whereClause = {
                    community: {
                        id: {
                            in: subscriptionsIds,
                        }
                    }
                }
            } else {
                whereClause = null
            }
        };

        if (whereClause) {
            postsCount = await prisma.post.count({
                where: whereClause
            });
            posts = await prisma.post.findMany({
                take: parseInt(limit),
                //  skip posts already shown
                skip: (parseInt(page) - 1) * parseInt(limit),
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    community: true,
                    votes: true,
                    author: true,
                    comments: true,
                },
                where: whereClause,
            })
        } else {
            postsCount = await prisma.post.count();
            posts = await prisma.post.findMany({
                take: parseInt(limit),
                //  skip posts already shown
                skip: (parseInt(page) - 1) * parseInt(limit),
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    community: true,
                    votes: true,
                    author: true,
                    comments: true,
                }
            })
        };
        return new Response(JSON.stringify({ count: postsCount, posts }));
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed", { status: 422 })
        }
        return new Response("Could not fetch more posts", { status: 500 })
    }
}