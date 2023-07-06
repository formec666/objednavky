import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BackLink from '@/components/shared/back-link';
import { getServerSession } from 'next-auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions);
    let user = await prisma?.user.findUnique({where: {id: params.id}});
    if (!session?.user?.email){
        redirect('/')
        
    }

    if (params.id == 'me'){
        user = await prisma?.user.findUnique({where:{email: session.user.email}});
    }
    
    const current = await prisma?.user.findUnique({where:{email:session?.user?.email}})
    if (session?.user?.email != user?.email && !current?.isAdmin){
        redirect('/')
    }

    const userId = user?.id;

   async function saveChanges(formData:FormData){
    
        'use server'
        const data = {
            name: formData.get('name')?.toString(),
            tel: formData.get('tel')?.toString(),
            email: formData.get('email')?.toString(),
            note: formData.get('note')?.toString()
        }
        const deez =await prisma?.user.update({data: data, where: {id:userId}});
        revalidatePath("admin/users");
        revalidatePath("admin/dates");
        revalidatePath("users/[id]");
        revalidatePath("admin/dates/[id]");
        
    }

  return (
    <>
        
        <div className="z-10 w-full max-w-xl px-5 xl:px-0">
            <BackLink/>    
            <form className='flex flex-col' action={saveChanges}>
                <label>Email</label>
                <input defaultValue={user?.email||''} name={'email'} className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"></input>
                <label>Jméno</label>
                <input defaultValue={user?.name||''} name={'name'} className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"></input>
                <label>Telefon</label>
                <input defaultValue={user?.tel||''} name={'tel'}className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"></input>
                {current?.isAdmin &&
                    <>
                        <label>Poznámka (viditelná pouze pro administrátora)</label>
                        <input defaultValue={user?.note||''} name={'note'}className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"></input>
                    </>}
                
                <button type='submit' className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}">Uložit</button>
                
            </form>
        </div>
    </>
  ) 
}

export default Page