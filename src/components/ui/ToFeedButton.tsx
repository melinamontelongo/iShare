'use client'

import { ChevronLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { buttonVariants } from './Button'

const ToFeedButton = () => {
  const pathname = usePathname()

  // if path is /i/mycom, turn into /
  // if path is /i/mycom/post/cligad6jf0003uhest4qqkeco, turn into /r/mycom

  const subredditPath = getSubredditPath(pathname)

  return (
    <a href={subredditPath} className={buttonVariants({ variant:"ghost", className:"hover:bg-zinc-200 dark:hover:bg-zinc-800" })}>
      <ChevronLeft className='h-4 w-4 mr-1' />
      {subredditPath === '/' ? 'Back to feed' : 'Back to community'}
    </a>
  )
}

const getSubredditPath = (pathname: string) => {
  const splitPath = pathname.split('/')

  if (splitPath.length === 3) return '/'
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`
  // default path, in case pathname does not match expected format
  else return '/'
}

export default ToFeedButton