import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
// import Loading from '~/components/Loading'
import { api } from '~/utils/api'

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "am-miracle",
  });

  if(isLoading) return <div>Loading ...</div>
  if(!data) return <div>404</div>

  console.log(data)
  return (
    <>
    <Head>
      <title>Profile Page</title>
    </Head>
    <main className="flex justify-center h-screen relative">
        <div>profile</div>
    </main>
  </>
  )
}


export default ProfilePage