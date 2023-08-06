"use client"
import { User } from "next-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/DropdownMenu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { UserAvatar } from "./UserAvatar"

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
            <DropdownMenuContent className="" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user.email && <p className="w-[200px] truncate text-sm text-zinc-500 dark:text-zinc-600">{user.email}</p>}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/">Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/r/create">Create community</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault()
                    signOut({
                        callbackUrl: `${window.location.origin}/sign-in`
                    })
                }} className="cursor-pointer">
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}