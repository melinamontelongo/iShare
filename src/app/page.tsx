import Feed from "@/components/post/display/Feed";
import { buttonVariants } from "@/components/ui/Button"
import { getAuthSession } from "@/lib/auth"
import Link from "next/link"
import { AiFillHome } from "react-icons/ai"

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getAuthSession();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* feed */}
        <Feed />

        {/* community info */}
        <div className="overflow-hidden h-fit rounded-lg border border-zinc-200 dark:border-zinc-800 order-first md:order-last">
          <div className="bg-teal-100 dark:bg-teal-800 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <AiFillHome className="w-4 h-4" />
              Home
            </p>
          </div>

          <div className="px-6 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-600 dark:text-zinc-500">
                Your personal iShare homepage. Come here to check in with your favorite communities.
              </p>
            </div>
          </div>

          <Link href="/i/create" className={buttonVariants({ className: "w-full mt-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100" })}>Create community</Link>
        </div>
      </div>
    </>
  )
}
