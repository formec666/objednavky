import { revalidatePath } from 'next/cache'
import React from 'react'
import prisma from '@/lib/prisma';
import { redirect, useRouter } from 'next/navigation';

const Notification = async({params}: {params: {id: string}}) => {
    const notification = await prisma.notification.findUnique({where:{id: params.id}})
    

    async function saveChanges(formData: FormData){
      'use server'
      const notifcation = await prisma?.notification.update({data:
      {
        body: formData.get('body')?.toString()||'',
        link: formData.get('link')?.toString()||''
      },
      where:{id: notification?.id}
      });
      revalidatePath("/admin/notifications/[id]");
      revalidatePath("/");
      revalidatePath("/admin/main");
      
      redirect('/admin/main');
    }

    async function deleteThis(){
      'use server'
      const deez = await prisma?.notification.delete({where: {id:notification?.id}});
      revalidatePath("/admin/notifications/[id]");
      revalidatePath("/");
      revalidatePath("/admin/main");
      redirect('/admin/main');
    }

  return (
    <form className='relative flex flex-col' action={saveChanges}>
        <label>Upozornění</label>
        <input type='text' name={'body'} defaultValue={notification?.body} className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"/>
        <label>Odkaz (například seznam.cz)</label>
        <input type='text' name={'link'} defaultValue={notification?.link || ''} className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"/>
        <button type='submit' className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"
            >Uložit</button>
        <button type='submit' formAction={deleteThis}
          className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"
        >Smazat</button>
    </form>
  )
}

export default Notification