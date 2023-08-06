import { z } from "zod";

export const UserValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(16),
})

export type UserCredentials = z.infer<typeof UserValidator>