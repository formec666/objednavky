import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Popover from '@/components/shared/popover';
import { randomInt } from 'crypto';
import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { UserGrid } from '../../users/UserGrid';

const Users = async ({ params }: { params: { id: string } }) => {
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



  return (
    <>
        <div className="z-10 w-full max-w-xl px-5 xl:px-0" >
            <h1>
                Uživatelé
            </h1><form>
            <button 
                formAction={makeNew}
                className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"
            >Vytvořit nového uživatele</button></form>
            <UserGrid users={users} handleClick={`/admin/dates/${params.id}`}/>
        </div>
    </>
  )
}



export default Users