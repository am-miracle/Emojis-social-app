import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(relativeTime)

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return(
    <div className="flex items-center gap-3 p-4 border-b border-slate-400" key={post.id}>
      <Image
        src={author.profileImageUrl}
        alt={`${author.username === null ? author.firstName : author.username} avatar`}
        className="w-14 h-14 rounded-full"
        width={14}
        height={14}
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-slate-400">
          <Link href={`/${author.username === null ? author.firstName: `@${author.username}`}`}>
            <span className='text-white font-medium'>{author.username === null ? author.firstName: `@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="text-sm"> · {dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  )
}

export default PostView