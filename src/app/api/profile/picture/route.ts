import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfilePicValidator } from "@/lib/validators/profile";
import {z} from "zod";

export async function PUT(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { imageUrl } = ProfilePicValidator.parse(body);

        await prisma.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                image: imageUrl,
            }
        })
        return new Response("OK");
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed", { status: 422 })
        }
        return new Response("Could not update username, please try again later", { status: 500 })
    }
}