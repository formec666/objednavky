import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Popover from '@/components/shared/popover';
import { randomInt } from 'crypto';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const Users = async ({ params }: { params: { id: string, uid: string } }) => {
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
    const users =await prisma.user.findMany();
    async function makeNew(){
        'use server'
        const deez = await prisma.user.create({data:{}});
        console.log(deez);
        redirect(`/users/${deez.id}`);
    }
    const appointment = await prisma.appointment.update({where: {id: params.id}, data: {userId: params.uid}});
    revalidatePath('/admin/dates');
    redirect('/admin/dates');
  
}



export default Users