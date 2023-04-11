import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
// import Loading from '~/components/Loading'
import { api } from '~/utils/api';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { prisma } from "~/server/db"
import { appRouter } from '~/server/api/root';
import superjson from 'superjson';
import Layout from '~/components/Layout';

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
      <div>{data.username}</div>
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