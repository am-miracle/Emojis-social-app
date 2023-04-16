import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Loading from '~/components/Loading'
import { api } from '~/utils/api';
import Layout from '~/components/Layout';
import Image from 'next/image';
import PostView from '~/components/PostView';
import { generateSSGHelper } from '~/server/helpers/ssgHelpers';


const ProfileFeed = (props: { userId: string}) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  })

  if(isLoading) return <Loading />;
  if(!data || data.length === 0) return <p>User has not posted yet</p>

  return (
    <div className="flex flex-col">
      {data.map(fullPost => (<PostView {...fullPost} key={fullPost.post.id} />))}
    </div>
  )
}


const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if(!data) return <div>404</div>

  return (
    <>
    <Head>
      <title>{data.username}</title>
    </Head>
    <Layout>
      <div className='h-36 border-slate-400 bg-slate-600 relative'>
        <Image
          src={data.profileImageUrl}
          alt={`@${data.username ?? ""} profile pic`}
          className="rounded-full absolute bottom-0 left-0 -mb-[64px] ml-4 border-4 border-black bg-black"
          width={128}
          height={128}
        />
      </div>
      <div className='h-[70px]'></div>
      <div className='p-4'>
        <h1 className='text-2xl font-semibold'>{data.firstName}</h1>
        <h3 className='text-slate-400'>{`@${data.username ?? ""}`}</h3>
      </div>
      <div className="border-b border-slate-400" />
      <ProfileFeed userId={data.id} />
    </Layout>
  </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "")

  await ssg.profile.getUserByUsername.prefetch({ username })

  return{
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking"}
}

export default ProfilePage