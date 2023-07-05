import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { postId, text, replyToId } = CommentValidator.parse(body);
        const session = await getAuthSession();
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }
        await prisma.comment.create({
            data: {
                text,
                postId,
                authorId: session.user.id,
                replyToId,
            }
        })
        return new Response("OK");
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed", { status: 422 })
        }
        return new Response("Could not create comment, please try again later.", { status: 500 })
    }
}