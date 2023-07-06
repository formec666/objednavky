import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import React from 'react'
import Balancer from 'react-wrap-balancer'
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

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
  return (
    <div>
        <Balancer>Main</Balancer>
    </div>
  )
}

export default Main