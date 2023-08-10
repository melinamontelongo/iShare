import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const session = await getAuthSession();
        const postId = url.searchParams.get("id");

        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        if (!postId) return new Response("Invalid query", { status: 400 });

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            select: {
                authorId: true,
            }
        });

        if (!post) return new Response("Post not found", { status: 404 });

        if (post.authorId !== session.user.id) return new Response("Only the post author can delete it", { status: 403 });

        await prisma.$queryRaw`DELETE FROM Post WHERE id = ${postId}`

        return new Response("OK");
    } catch (e) {
        return new Response("Could not delete post, please try again later.", { status: 500 })
    }
}
