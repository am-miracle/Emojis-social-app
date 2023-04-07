import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { RouterOutputs } from "~/utils/api";
import Loading from "~/components/Loading";
import { useState } from "react";
import InputEmoji from "react-input-emoji";
import toast from 'react-hot-toast';
import Link from "next/link";



dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");

  const ctx = api.useContext();
  const { mutate, isLoading, isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0])
      }
      else{
        toast.error("Failed to post. Please try again later")
      }
    }
  });

  const handleOnEnter = (input) => {
    if(input !== ""){
      mutate({ content: input });
    }
  }
  if(!user) return null;

  return(
    <div className="flex gap-3 w-full h-auto relative py-3">
      <Image
        src={user.profileImageUrl}
        alt="User profile image"
        className="w-14 h-14 rounded-full"
        width={14}
        height={14}
      />
      {/* <input
        type="text"
        placeholder="Type some emojis"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="bg-transparent grow outline-none"
        disabled={isPosting}
        onKeyDown={(e) => {
          if(e.keyCode === "Enter"){
            e.preventDefault();
            if(input !== ""){
              mutate({ content: input });
            }
          }
        }}
      /> */}
        <InputEmoji
          value={input}
          onChange={setInput}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type some emojis"
          theme="auto"
        />
      {input !== "" && !isPosting && (<button
        type="submit"
        onClick={() => mutate({ content: input})}
        className=""
      >
        Post
      </button>)}
      {isPosting && (
        <div className="flex items-center justify-center text-sm">
          <Loading />
        </div>
      )}
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return(
    <div className="flex items-center gap-3 p-4 border-b border-slate-400" key={post.id}>
      <Image
        src={author.profileImageUrl}
        alt={`${author.firstName} avatar`}
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

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if(postsLoading) return <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center my-0 mx-auto h-screen w-screen"><Loading /></div>
  if(!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();

  // Start fetching data early
  api.posts.getAll.useQuery();

  if(!userLoaded) return <div />



  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen relative">
        <div className="w-full h-full md:max-w-2xl border-x border-slate-400">
          <Feed />
          <div className="sticky bottom-0 bg-black p-4 flex">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
