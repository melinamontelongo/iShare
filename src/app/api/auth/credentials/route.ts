import { prisma as db } from "@/lib/db";
import { UserValidator } from "@/lib/validators/user";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = UserValidator.parse(body);
        const userExists = await db.user.findFirst({
            where: {
                email,
            }
        });

        if (userExists) return new Response("That email address has already been registered.", { status: 409 });

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return new Response("There was an error registering the user.", { status: 500 })
            };
            await db.user.create({
                data: {
                    email,
                    password: hash,
                    username: nanoid(10),
                }
            })
        })
        return new Response("OK");
    } catch (e) {
        return new Response("There was an error registering the user.", { status: 500 });
    }
}