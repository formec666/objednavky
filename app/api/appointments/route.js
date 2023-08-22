import { headers } from 'next/headers'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request, { params }) {
    const body = await request.json()
    console.log(body.day);
    const morning = new Date(body.day);
    const evening = new Date(morning.getTime()-(-86400000))
    const appointments = await prisma.appointment.findMany({where:{
      time:{
        gte: morning.toISOString(),
        lt: evening.toISOString()
      }
    }})
    return NextResponse.json({message: 'Success', data: appointments})
}