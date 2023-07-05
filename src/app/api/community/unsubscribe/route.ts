import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CommunitySubscriptionValidator } from "@/lib/validators/community";
import z from "zod"

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }
        const body = await req.json()
        const { communityId } = CommunitySubscriptionValidator.parse(body)
        const subscriptionExists = await prisma.subscription.findFirst({
            where: {
                communityId,
                userId: session.user.id,
            },
        })
        if (!subscriptionExists) {
            return new Response("You are not subscribed to this community", { status: 400 })
        }
        //  User can't unsubscribe if they created the community
        const community = await prisma.community.findFirst({
            where: {
                id: communityId,
                creatorId: session.user.id,
            },
        })
        if(community) {
            return new Response("You can't unsubscribe from your own community", {status: 400})
        }
        await prisma.subscription.delete({
            where:{
                userId_communityId: {
                    communityId,
                    userId: session.user.id,
                }
            }
        })
        return new Response(communityId)
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed", { status: 422 })
        }
        return new Response("Could not unsubscribe, please try again later", { status: 500 })
    }
}