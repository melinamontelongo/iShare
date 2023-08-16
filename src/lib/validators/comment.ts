import {z} from "zod"

export const CommentValidator = z.object({
    postId: z.string(),
    text: z.string().max(500, {message: "Comment should be under 500 characters"}),
    replyToId: z.string().optional(),
})

export type CommentRequest = z.infer<typeof CommentValidator>