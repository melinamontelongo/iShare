import {z} from "zod";

export const ProfilePicValidator = z.object({
    imageUrl: z.string().url()
});

export type ProfilePicRequest = z.infer<typeof ProfilePicValidator>;