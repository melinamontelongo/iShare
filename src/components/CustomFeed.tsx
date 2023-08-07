import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { prisma } from "@/lib/db";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";

export default async function CustomFeed(){
    const session = await getAuthSession();
    //  Get user's subscriptions
    const subscriptions = await prisma.subscription.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            community: true,
        }
    })
    //  Get posts from the user's followed communities
    const posts = await prisma.post.findMany({
        where: {
            community: {
                name: {
                    in: subscriptions.map(({community}) => community.name)
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
    })
    console.log("POSTS FROM CUSTOM FEED", posts)

    return <PostFeed initialPosts={posts} />
}