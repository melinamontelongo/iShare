import { VoteType } from "@prisma/client"

export type CachedPost = {
    id: string,
    title: string,
    authorUsername: string,
    authorId: string,
    communityName: string,
    content: string,
    createdAt: Date
}