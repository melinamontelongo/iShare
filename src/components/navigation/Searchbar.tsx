"use client"
import { useQuery } from "@tanstack/react-query";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/Command";
import { useCallback, useEffect, useRef, useState } from "react";
import { Community, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import {usePathname} from "next/navigation";

export default function Searchbar({ }) {
    const [input, setInput] = useState<string>("");
    const router = useRouter();
    const commandRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const { data: queryResults, refetch, isFetched, isFetching, isRefetching } = useQuery({
        queryFn: async () => {
            if (!input) return [];
            const { data } = await axios.get(`/api/search?q=${input}`);
            return data as (Community & {
                _count: Prisma.CommunityCountOutputType,
            })[]
        },
        queryKey: ["search-query"],
        enabled: false, //Only make request when user types
    })

    //  Debounce
    const request = debounce(() => {
        refetch();
    }, 300)
    const debounceRequest = useCallback(() => {
        request();
    }, []);

    useOnClickOutside(commandRef, () => {
        setInput("");
    });

    useEffect(() => {
        setInput("");
    },[pathname])

    return (
        <Command ref={commandRef} className="relative rounded-lg border border-zinc-200 dark:border-zinc-800 max-w-lg h-auto z-50 overflow-visible bg-zinc-100 dark:bg-zinc-900">
            <CommandInput
                className="outline-none border-none focus:border-none focus:outline-none ring-0 bg-zinc-100 dark:bg-zinc-900 placeholder:text-zinc-600 placeholder:dark:text-zinc-500"
                placeholder="Search communities..."
                value={input}
                onValueChange={(text) => {
                    setInput(text);
                    debounceRequest();
                }}
            />
            {input.length > 0 && (
                <CommandList className="absolute top-full inset-x-0 shadow rounded-b-md bg-zinc-50 dark:bg-zinc-950">
                    {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading="Communities" className="text-zinc-600 dark:text-zinc-500">
                            {queryResults?.map((community) => (
                                <CommandItem
                                    className="bg-zinc-100 dark:bg-zinc-900"
                                    key={community.id}
                                    value={community.name}
                                    onSelect={(e: any) => {
                                        router.push(`/i/${e}`);
                                        router.refresh();
                                    }}>
                                    <Users className="mr-2 h-4 w-4" />
                                    <a href={`/i/${community.name}`}>i/{community.name}</a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            )}
        </Command>
    )
}