import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
// import Loading from '~/components/Loading'
import { api } from '~/utils/api';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { prisma } from "~/server/db"
import { appRouter } from '~/server/api/root';
import superjson from 'superjson';
import Layout from '~/components/Layout';
import Image from 'next/image';

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
          alt={`${data.username === null ? data.firstName : data.username}'s profile pic`}
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
      <div className="border-b border-slate-400"></div>
    </Layout>
  </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "")

  await ssg.profile.getUserByUsername.prefetch({ username})

  return{
    props: {
      trpcState: ssg.dehydrate(),
      username
    },
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking"}
}

export default ProfilePage