import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import z from "zod"

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }
        const body = await req.json()
        const { communityId, title, content } = PostValidator.parse(body)
        const subscriptionExists = await prisma.subscription.findFirst({
            where: {
                communityId,
                userId: session.user.id,
            },
        })
        if (!subscriptionExists) {
            return new Response("Subscribe to post", { status: 400 })
        }
        await prisma.post.create({
            data: {
                title,
                content,
                authorId: session.user.id,
                communityId,
            }
        })
        return new Response("Ok")
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed", { status: 422 })
        }
        return new Response("Could not post to community, please try again later.", { status: 500 })
    }
}