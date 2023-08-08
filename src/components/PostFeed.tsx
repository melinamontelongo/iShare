"use client"
import { useIntersection } from "@mantine/hooks"
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { ExtendedPost } from "@/types/extended-post";
import { useSession } from "next-auth/react";
import { Ring } from '@uiball/loaders'
import { useTheme } from "next-themes";
import Post from "./Post";

interface PostFeedProps {
    initialPosts: {
        count: number,
        posts: ExtendedPost[],
    },
    communityName?: string,
}

export default function PostFeed({ initialPosts, communityName }: PostFeedProps) {

    const { resolvedTheme } = useTheme();

    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })
    const { data: session } = useSession();

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["infiniteQuery"],
        queryFn: async ({ pageParam = 1 }) => {
            const query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
                (!!communityName ? `&communityName=${communityName}` : "");
            const { data } = await axios.get(query);
            return data;
        },
        getNextPageParam: (prev, pages) => {
            if (prev.count / INFINITE_SCROLLING_PAGINATION_RESULTS >= pages.length) {
                return pages.length + 1
            } else {
                //  No next page
                return undefined;
            }
        },
        initialData: { pages: [initialPosts], pageParams: [1] }
    })

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    const posts: ExtendedPost[] = data?.pages.flatMap((page) => page.posts) ?? initialPosts.posts;
 
    return <ul className="flex flex-col col-span-2 space-y-6">
        {posts.map((post, index) => {
            const votesAmount = post.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
            }, 0)

            const currentUserVoted = post.votes.find((vote) => vote.userId === session?.user.id)

            if (index === posts.length - 1) {
                return (
                    <li key={post.id} ref={ref}>
                        <Post
                            currentVote={currentUserVoted}
                            votesAmount={votesAmount}
                            commentAmount={post.comments.length}
                            communityName={post.community.name}
                            post={post} />
                    </li>
                )
            } else {
                return (
                    <Post key={post.id}
                        currentVote={currentUserVoted}
                        votesAmount={votesAmount}
                        commentAmount={post.comments.length}
                        communityName={post.community.name}
                        post={post} />
                )
            }
        })}
        {isFetchingNextPage &&
            <div className="flex justify-center">
                <Ring
                    size={30}
                    lineWeight={5}
                    speed={2}
                    color={`${resolvedTheme === "dark" ? "#f4f4f5" : "#18181b"}`}
                />
            </div>
        }
    </ul>
}