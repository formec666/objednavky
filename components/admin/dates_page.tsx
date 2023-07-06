'use client'
import { Appointment } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import ComponentGrid from '../home/component-grid';
import Card from '../home/card';
import { ArrowBigLeft, ArrowBigRight, DeleteIcon } from 'lucide-react';
import Modal from '../shared/modal';
import { LoadingDots } from '../shared/icons';

import { Prisma } from '@prisma/client'
import Link from 'next/link';

type AppointmentWithUser = Prisma.AppointmentGetPayload<{
  include: { user: true }
}>


const DatesPage = (props:{appointments: AppointmentWithUser[]}) => {
    var today = new Date().toDateString();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addingTime, setAddingTime] = useState();
    
    const [beginningDay, setBeginningDay] = useState(new Date(today));
    //console.log(beginningDay);
    const [allDays, setAllDays] = useState([{date: new Date(beginningDay.getTime()), appointments: []}]);
    
    const [appointments, setAppointments] = useState(props.appointments);
    useEffect(() => {
        var days:any[] = [];
        for (var i = 0; i < 5; i++){
            days.push({date: new Date(beginningDay.getTime() + 86400000*i), appointments: appointments?.filter(({time})=>(new Date(time.toDateString())).getTime() == beginningDay.getTime() + 86400000*i)});
            // fucking terryfing, i pray to all the seven gods that this never breaks because i will have no idea how to fix it
        }
        
        setAllDays(days);
        console.log(days);
    }, [beginningDay, appointments])
    
    const days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    const [addingToDay, setAddingToDay] = useState(allDays[0]);

    const addAndSave = async(setModal: boolean)=>{
        setLoading(true);
        const res = await fetch('/api/dates', {
            method: 'POST',
            body: JSON.stringify(
                {time: addingTime,
                day: addingToDay.date.toDateString()}
            )
        })
        const data = await res.json();
        const newAppointment: AppointmentWithUser = data.newAppointment;
        newAppointment.time = new Date(newAppointment.time);
        console.log(data);
        setAppointments([...appointments, newAppointment]);
        setLoading(false);
        setShowModal(setModal);
    }
  return (<>
        <Modal
            showModal={showModal}
            setShowModal={addAndSave}
        >
            <div className='p-4 flex flex-col'>
                <button className='p-2 m-2 font-semibold text-xl border-2 rounded-md border-black' onClick={()=>addAndSave(false)}>{loading?<LoadingDots/>:'Uložit'}</button>
                <input type="time" value={addingTime} name="time" id="time" className=' rounded-md border-black' onChange={(e:any)=>setAddingTime(e.target.value)}/>
                
            </div>
        </Modal>
        <div className='flex flex-row w-full h-full relative justify-evenly'>
            <button onClick={()=>setBeginningDay(new Date(beginningDay.getTime()-86400000*5))}><ArrowBigLeft/></button>
            {allDays.map((day:any, index:number)=>(
                
                <div key={day.date.toLocaleDateString()} className='rounded bg-white h-full w-full m-4 p-2'>
                    <div className='text-center text-xl font-bold pb-2 border-b-2'>{days[day.date.getDay()]}</div>
                    <div className='text-center text-sm '>{day.date.toLocaleDateString("cs-CZ")}</div>
                    <ul className='h-full text-center'>
                        {day.appointments.map((appointment: AppointmentWithUser)=>(
                            <li key={appointment.id} className='p-2 border-b-2'>
                                <div className='flex flex-row justify-between'>
                                    <div className='text-lg font-semibold'>
                                        {appointment.time.toLocaleTimeString("cs-CZ")}

                                    </div>{!appointment.user &&
                                    <button onClick={async()=>{
                                    
                                       setLoading(true);
                                       const res = await fetch('/api/dates', {
                                           method: 'DELETE',
                                           body: JSON.stringify(
                                               {id: appointment.id}
                                           )
                                       })
                                       const body =await res.json();
                                       setAppointments(appointments.filter(appointment => appointment.id != body.deleted.id ))
                                       setLoading(false)
                                    }}>
                                        {loading?<LoadingDots/>:<DeleteIcon/>}
                                    </button>}
                                </div>
                                <div className='flex flex-row justify-between'>
                                    <div>
                                        {appointment.user ? <Link href={`/users/${appointment.user.id}`}>{appointment.user.name}</Link>: <Link href={`/admin/dates/${appointment.id}`}>Pacient</Link>}
                                    </div>
                                </div>
                            </li>
                        ))
                        }
                    </ul>
                    <div className='text-center'>
                        <button
                            onClick={()=>{
                                setShowModal(true);
                                setAddingToDay(day);
                            }}
                        >Přidat termín</button>
                    </div>
                </div>
            ))}
            
            <button onClick={()=>setBeginningDay(new Date(beginningDay.getTime()-(-86400000*5)))}><ArrowBigRight/></button>
            
        </div>
    </>
  )
}

export default DatesPage