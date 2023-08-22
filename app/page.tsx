import Card from "@/components/home/card";
import Balancer from "react-wrap-balancer";
import { DEPLOY_URL } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { nFormatter } from "@/lib/utils";
import prisma from '@/lib/prisma';
import Notifications from "@/components/home/notifications";
import DayCard from "@/components/home/DayCard";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const notifications = await prisma.notification.findMany();
  const morning = new Date()
  morning.setHours(0,0,0,0)
  const evening = new Date(morning.getTime()-(-86400000))
  const dates = await prisma.appointment.findMany({where:{
    time:{
      gte: morning.toISOString(),
      lt: evening.toISOString()
    },
    userId: null
  }})

  console.log(dates);
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({where:{email:session?.user?.email||undefined}})
  
  if (user?.id && (!user.tel || !user.name)){
      redirect('/users/'+user.id);
  }

  return (
  <div>
    <div className="relative flex flex-col items-start">
      <Notifications notifications={notifications}/>
    </div>
    {session?.user?<DayCard appointments={dates} morning={morning}/>:<DaysForbidden/>}
    
  </div>
      
  );
}

const DaysForbidden = () => {
  return (
    <>Pro objednání se přihlaste a vyplňte telefon a jméno</>
  )
}

const features = [
  {
    title: "Beautiful, reusable components",
    description:
      "Pre-built beautiful, a11y-first components, powered by [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Framer Motion](https://framer.com/motion)",
    large: true,
  },
  {
    title: "Performance first",
    description:
      "Built on [Next.js](https://nextjs.org/) primitives like `@next/font` and `next/image` for stellar performance.",
    demo: <WebVitals />,
  },
  {
    title: "One-click Deploy",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
      <a href={DEPLOY_URL}>
        <Image
          src="https://vercel.com/button"
          alt="Deploy with Vercel"
          width={120}
          height={30}
          unoptimized
        />
      </a>
    ),
  },
  {
    title: "Built-in Auth + Database",
    description:
      "Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <Image alt="Auth.js logo" src="/authjs.webp" width={50} height={50} />
        <Image alt="Prisma logo" src="/prisma.svg" width={50} height={50} />
      </div>
    ),
  },
  {
    title: "Hooks, utilities, and more",
    description:
      "Precedent offers a collection of hooks, utilities, and `@vercel/og`",
    demo: (
      <div className="grid grid-flow-col grid-rows-3 gap-10 p-10">
        <span className="font-mono font-semibold">useIntersectionObserver</span>
        <span className="font-mono font-semibold">useLocalStorage</span>
        <span className="font-mono font-semibold">useScroll</span>
        <span className="font-mono font-semibold">nFormatter</span>
        <span className="font-mono font-semibold">capitalize</span>
        <span className="font-mono font-semibold">truncate</span>
      </div>
    ),
  },
];
