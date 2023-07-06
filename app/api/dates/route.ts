import { headers } from 'next/headers'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
 
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({where:{email: session?.user?.email || ''}})
    if (!user?.isAdmin){
        return NextResponse.json({message: 'Unauthorized'});
    }

    const body = await request.json()
    const date = new Date(body.day + ' ' + body.time);
    const newAppointment =await prisma.appointment.create({data: {time: date}})
    return NextResponse.json({message: 'success', newAppointment: newAppointment});
}

export async function DELETE(request: Request){
    const deleted = await prisma.appointment.delete({where:{id: (await request.json()).id}});
    return NextResponse.json({
        message:'success', deleted: deleted
    })
}