import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DatesPage from '@/components/admin/dates_page'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'
import prisma from '@/lib/prisma';

const page = async() => {
  const session = await getServerSession(authOptions);
    
    if (session?.user?.email){
        const user = await prisma?.user.findUnique({where: {email: session.user.email}})
        if (!user?.isAdmin){
          redirect('/');
        }
    }
    else{
      redirect('/');
    }
    const appointments = await prisma?.appointment.findMany({include:{user:true}, orderBy: {time: 'asc'}});
  return (
        <DatesPage appointments={appointments}/>
    
  )
}

export default page