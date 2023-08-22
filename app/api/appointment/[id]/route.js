import { headers } from 'next/headers'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({where:{email: session?.user?.email || ''}})
    if (!user?.tel || !user.email || !user.name){
        return NextResponse.json({message: 'Nekompletní profil', error: true});
    }
    let appointment = await prisma.appointment.findUnique({where: {id: params.id}});
    if (appointment.userId){
        return NextResponse.json({message: 'Tento termín je již obsazen', error: true});
    }
    appointment = await prisma.appointment.update({where: {id: params.id}, data: {userId: user.id}});
    console.log(params.id);
    return NextResponse.json({message: `Uložili jsme vám termín ${ appointment.time.getHours()}:${appointment.time.getMinutes()} a upozornění jsme vám zaslali na email`, error: false})
}