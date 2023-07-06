import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { nFormatter } from "@/lib/utils";
import { DEPLOY_URL } from "@/lib/constants";


import prisma from '@/lib/prisma';
import Balancer from "react-wrap-balancer";
import Card from "@/components/home/card";
import { AlarmClock, AlignStartVertical, User } from "lucide-react";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { User as UserInterface } from "@prisma/client";
import { redirect } from "next/navigation";

const Home = async (props:{user:UserInterface}) => {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.email){
        const user = await prisma.user.findUnique({where: {email: session.user.email}})
        if (!user?.isAdmin){
          redirect('/');
        }
    }
    else{
      redirect('/');
    }
    
  return (
    <div >
        <Balancer>Administrace</Balancer>
        <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
          <Link href={'/admin/main'}>
              <Card
                  title="Hlavní administrace"
                  description="Objednání pro dnešní den"
                  demo={<AlignStartVertical />}
              />
          </Link>
          <Link href={'/admin/dates'}>
              <Card
                  title="Termíny"
                  description="Vypisovánní termínů a jejich správa"
                  demo={<AlarmClock />}
              />
          </Link>
          <Link href={'/admin/users'}>
              <Card
                  title="Uživatelé"
                  description="Uživatelé a jejich správa"
                  demo={<User />}
              />
          </Link>
        </div>
    </div>
    

      
  );
}


export default Home;