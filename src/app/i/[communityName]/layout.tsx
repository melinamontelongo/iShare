import SubscribeLeaveToggle from "@/components/community/SubscribeLeaveToggle"
import ToFeedButton from "@/components/ui/ToFeedButton"
import { buttonVariants } from "@/components/ui/Button"
import { getAuthSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { format } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function communityLayout({ children, params: { communityName } }: { children: React.ReactNode, params: { communityName: string } }) {
    const session = await getAuthSession()
    const community = await prisma.community.findFirst({
        where: { name: communityName },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                },
            },
        },
    })

    const subscription = !session?.user ? undefined : await prisma.subscription.findFirst({
        where: {
            community: {
                name: communityName,
            },
            user: {
                id: session.user.id,
            },
        },
    })
    const isSubscribed = !!subscription;

    if (!community) return notFound()

    const subscribersCount = await prisma.subscription.count({
        where: {
            community: {
                name: communityName
            },
        },
    })

    return (
        <div className="pt-12 px-2">
            <ToFeedButton />
            <h1 className="font-bold text-3xl md:text-4xl h-14 md:hidden block">i/{community.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                <div className="flex flex-col col-span-2 space-y-6">{children}</div>
                {/* INFO SIDEBAR */}
                <div className="overflow-hidden h-fit rounded-lg border border-zinc-200 dark:border-zinc-800 order-first md:order-last">
                    <div className="px-6 py-4">
                        <p className="font-semibold py-3">About i/{communityName}</p>
                    </div>
                    <dl className="divide-y divide-zinc-200 dark:divide-zinc-800 px-6 py-4 text-sm leading-6 ">
                        <div className="flex justify-between gap-x-4 py-3">
                            <dt className="text-zinc-500">
                                Created
                            </dt>
                            <dd className="text-zinc-700">
                                <time dateTime={community.createdAt.toDateString()}>
                                    {format(community.createdAt, "MMMM d, yyyy")}
                                </time>
                            </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                            <dt className="text-zinc-500">
                                Subscribers
                            </dt>
                            <dd className="text-zinc-700">
                                <div className="">{subscribersCount}</div>
                            </dd>
                        </div>
                        {community.creatorId === session?.user.id ? (
                            <div className="flex justify-between gap-x-4 py-3">
                                <p className="text-zinc-500">You created this community.</p>
                            </div>
                        ) : null}
                        {community.creatorId !== session?.user.id ? (
                            <SubscribeLeaveToggle communityId={community.id} communityName={community.name} isSubscribed={isSubscribed} />
                        ) : null}
                        {isSubscribed && <Link className={buttonVariants({
                            variant: "default",
                            className: "w-full mt-1 mb-4 bg-teal-500 dark:bg-teal-600 hover:dark:bg-teal-700 hover:bg-teal-600 outline-none border-none"
                        })}
                            href={`/i/${communityName}/submit`}>Create Post</Link>}
                    </dl>
                </div>
            </div>
        </div>
    )
}