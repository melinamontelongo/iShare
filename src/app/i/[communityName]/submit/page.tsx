import Editor from "@/components/post/create/Editor";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        communityName: string,
    }
}

export default async function submit({params}:PageProps){
    const community = await prisma.community.findFirst({
        where: {
            name: params.communityName,
        },
    })
    if(!community) return notFound();

    return (
    <div className="flex flex-col items-start gap-6">
        <div className="border-b border-gray-200 pb-5">
            <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                <h3 className="ml-2 mt-2 text-base font-semibold leading-6">Create post</h3>
            <p className="ml-2 mt-1 truncate text-sm text-gray-500">In i/{community.name}</p>
            </div>
        </div>
        <Editor communityId={community.id} />
    </div>
    )
}