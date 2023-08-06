import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        communityName: string,
    }
}

export default async function communityPage({ params }: PageProps) {
    const { communityName } = params;
    const session = await getAuthSession();
    const community = await prisma.community.findFirst({
        where: { name: communityName },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    community: true,
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: INFINITE_SCROLLING_PAGINATION_RESULTS
            }
        }
    })
    if (!community) return notFound()

    return <>
        <h1 className="font-bold text-3xl md:text-4xl h-14">i/{community.name}</h1>
        <MiniCreatePost session={session} />
        <PostFeed initialPosts={community.posts} communityName={community.name} />
    </>
}