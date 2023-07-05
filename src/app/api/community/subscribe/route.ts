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
        if (subscriptionExists) {
            return new Response("You are already subscribed to this community", { status: 400 })
        }
        await prisma.subscription.create({
            data: {
                communityId,
                userId: session.user.id,
            },
        })
        return new Response(communityId)
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed", { status: 422 })
        }
        return new Response("Could not subscribe, please try again later", { status: 500 })
    }
}