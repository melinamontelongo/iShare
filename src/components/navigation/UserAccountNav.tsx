"use client"
import { User } from "next-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/DropdownMenu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { UserAvatar } from "../ui/UserAvatar"

interface UserAccountNavProps {
    user: Pick<User, "name" | "image" | "email">
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    user={{ name: user.name || null, image: user.image || null }}
                    className='h-8 w-8'
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user.email && <p className="w-[200px] truncate text-sm text-zinc-500 dark:text-zinc-600">{user.email}</p>}
                    </div>
                </div>
                <DropdownMenuSeparator className="border border-zinc-200 dark:border-zinc-800" />
                <DropdownMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-900" asChild>
                    <Link href="/">Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-900"  asChild>
                    <Link href="/i/create">Create community</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-900"  asChild>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="border border-zinc-200 dark:border-zinc-800" />

                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault()
                    signOut({
                        callbackUrl: `${window.location.origin}/sign-in`
                    })
                }} className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}