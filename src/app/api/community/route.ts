import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CommunityValidator } from "@/lib/validators/community";
import {z} from "zod"

export async function POST(req: Request){
    try {
        const session = await getAuthSession()
        if(!session?.user){
            return new Response("Unauthorized", {status: 401})
        }
        const body = await req.json()
        const { name } = CommunityValidator.parse(body)

        const communityExists = await prisma.community.findFirst({
            where: {
                name,
            },
        })
        if (communityExists){
            return new Response("Community already exists", {status: 409})
        }

        const community = await prisma.community.create({
            data: {
                name,
                creatorId: session.user.id,
            }
        })
        
        await prisma.subscription.create({
            data: {
                userId: session.user.id,
                communityId: community.id,
            }
        })
        return new Response(community.name)
    } catch (e) {
        if(e instanceof z.ZodError){
            //  Wrong data was sent
            return new Response(e.message, {status: 422})
        }
        return new Response("Could not create community", {status: 500})
    }
}