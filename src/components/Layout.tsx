import type { PropsWithChildren } from 'react'

const Layout = (props: PropsWithChildren) => {
  return (
    <main className="flex justify-center h-screen relative">
        <div className="w-full h-full md:max-w-2xl border-x border-slate-400 flex flex-col">
            {props.children}
        </div>
    </main>
  )
}

export default Layout