import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { prisma } from "@/lib/db";
import PostFeed from "./PostFeed";

export default async function GeneralFeed(){
    const posts = await prisma.post.findMany({
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
    })
    return <PostFeed initialPosts={posts} />
}