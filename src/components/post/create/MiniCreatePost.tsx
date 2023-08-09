"use client"

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { UserAvatar } from "../../ui/UserAvatar";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { BsLink, BsImage } from "react-icons/bs";

interface MiniCreatePostProps {
    session: Session | null
}
export default function MiniCreatePost({ session }: MiniCreatePostProps) {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="overflow-hidden rounded-md shadow">
            <div className="h-full px-6 py-4 flex justify-between gap-6">
                <div className="relative">
                    <UserAvatar className="border border-zinc-200 dark:border-zinc-800" user={{
                        name: session?.user.name || null,
                        image: session?.user.image || null
                    }} />
                    <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500" />
                </div>
                <Input className="border border-zinc-200 dark:border-zinc-800 placeholder:text-zinc-600 placeholder:dark:text-zinc-500 focus-visible:ring-teal-600 dark:focus-visible:ring-teal-500 bg-zinc-100 dark:bg-zinc-900 placeholder:text-zinc-600 placeholder:dark:text-zinc-500"
                readOnly onClick={() => router.push(pathname + "/submit")} placeholder="Create post" />
                <Button variant="ghost" className="hover:bg-zinc-200 dark:hover:bg-zinc-800" onClick={() => router.push(pathname + "/submit")}><BsImage /></Button>
                <Button variant="ghost" className="hover:bg-zinc-200 dark:hover:bg-zinc-800" onClick={() => router.push(pathname + "/submit")}><BsLink /></Button>
            </div>
        </div>
    )
}