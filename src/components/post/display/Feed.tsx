import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { prisma } from "@/lib/db";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";

export default async function Feed() {
    const session = await getAuthSession();

    const generalPostsCount = await prisma.post.count();

    const generalPosts = await prisma.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            community: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    });
    //  Not logged user
    if (!session?.user) {
        return <PostFeed initialPosts={{ count: generalPostsCount, posts: generalPosts }} />
    } else {
        //  Logged user
        //  Get user's subscriptions
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: session?.user.id,
            },
            include: {
                community: true,
            }
        });
        //  User has subscriptions
        if (subscriptions.length > 0) {
            //  Get posts from the user's followed communities
            const customizedPostsCount = await prisma.post.count({
                where: {
                    community: {
                        name: {
                            in: subscriptions.map(({ community }) => community.name)
                        }
                    }
                }
            })
            const customizedPosts = await prisma.post.findMany({
                where: {
                    community: {
                        name: {
                            in: subscriptions.map(({ community }) => community.name)
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    votes: true,
                    author: true,
                    comments: true,
                    community: true,
                },
                take: INFINITE_SCROLLING_PAGINATION_RESULTS
            });

            if (customizedPosts.length > 0) {
                return <PostFeed initialPosts={{ count: customizedPostsCount, posts: customizedPosts }} />
            } else {
                //  There are no posts from communities the user follows
                return <PostFeed initialPosts={{ count: generalPostsCount, posts: generalPosts }} />
            }
            //  User has no subscriptions
        } else {
            return <PostFeed initialPosts={{ count: generalPostsCount, posts: generalPosts }} />
        };
    };
}