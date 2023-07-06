import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { sfPro, inter } from "@/app/fonts";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";
import { useSession } from "next-auth/react"
import { SessionProvider } from "next-auth/react"


export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    
    return (
        
       
        <SessionProvider session={session}>
            <div className="fixed z-1 h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
                <Component {...pageProps}/>
        </SessionProvider>
     
    )
  }

  const NavigationBar = async () =>{ 
    const { data: session, status } = await useSession()
    return (
        <Navbar session={session}/>
    )
  }

  export async function getInitialProps({ req, res }) {
    return {
      props: {
        session: await getServerSession(req, res, authOptions)
      }
    }
  }

