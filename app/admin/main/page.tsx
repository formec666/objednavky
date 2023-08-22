import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import React from 'react'
import Balancer from 'react-wrap-balancer'
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/home/card';
import { AlertTriangle } from 'lucide-react';

const Main = async() => {
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
    const notifications = await prisma.notification.findMany();

    async function makeNew(){
        'use server'
        const deez = await prisma.notification.create({data:{body: 'Nové upozornění'}});
        console.log(deez);
        redirect(`/admin/notifcations/${deez.id}`);
    }
  return (
    <div className='relative flex flex-col'>
      <form>
            <button 
                formAction={makeNew}
                className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"
            >Vytvořit nové upozornění</button></form>
      {notifications.map((notification)=>(
        <Link key={notification.id} href={'notifcations/'+notification.id}>
          <Card
              demo = {<AlertTriangle/>}
              key={notification.id}
              title={notification.body||'Jméno a příjmení'}
              description={notification.link||'email'}
          />
        </Link>
      ))}
    </div>
  )
}

export default Main