'use client'
import React, { useEffect, useState } from 'react'
import Card from './card'
import { Appointment } from '@prisma/client'
import { LoadingDots } from '../shared/icons'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

const DayCard = (props:{appointments: Appointment[], morning: Date}) => {
    const [appointments, setAppointments] = useState(props.appointments);
    const [morning, setMorning] = useState(props.morning);
    const [loading, setLoading] = useState(false);
    const [wholeLoading, setWholeLoading] = useState(false);
    const [message, setMessage] = useState('Kliknutím vyberte z volných termínů');
    const [error, setError] = useState(false);

    useEffect(()=>{
        async function nothing() {
            setWholeLoading(true);
            const data = await fetch('/api/appointments', {
                method: 'POST',
                body: JSON.stringify({
                    day: morning.getTime()
                })
            })
            setMessage('Kliknutím vyberte z volných termínů');
            const body = await data.json();
            if (body.message == 'Success'){
                setError(false);
                const array = [];
                for(const appointment of body.data){
                    appointment.time = new Date(appointment.time)
                }
                setAppointments(body.data)
                setWholeLoading(false);
            }
            else {
                setError(true);
                setMessage(body.message);
                setAppointments([]);
            }
        }
        nothing()
        
    }, [morning])
  return (
    <div className='w-full h-full flex flex-row justify-center items-center'>
        <button className=' h-full p-8 relative flex flex-col justify-center items-center'
            onClick={()=>{
                setMorning(new Date(morning.getTime()-86400000))
            }}
        >
            <ArrowBigLeft/>
        </button>
        <Card 
            title={morning.toLocaleDateString()}
            description={'Kliknutím vyberte z volných termínů'}
            demo={wholeLoading?<LoadingDots/>:<div className='p-2'>
                <div className='grid grid-cols-4 gap-2'>
                    {appointments.map((appointment: Appointment, index: number)=>
                    <button key={appointment.id}
                        className={`bg-green-400 p-2 font-semibold text-lg rounded ${loading && 'bg-gray-200'}`} 
                        onClick={async()=>{
                            setLoading(true);
                            const data = await fetch(`/api/appointment/${appointment.id}`);
                            const body = await data.json();
                            setError(body.error)
                            setMessage(body.message)
                            setLoading(false)
                        }}
                        disabled = {loading}
                    >
                        {appointment.time.getHours()+':'+appointment.time.getMinutes()}
                    </button>
                    )}
                </div>
                <div className={`${error?'text-red-500':'text-green-500'} text-xl text-center`}>
                    {appointments.length!=0?(loading?<LoadingDots/>:message):'V tento den bohužel nemáme volné termíny'}
                </div>
            </div>}
            large={true}
        />
        <button className=' h-full p-8 relative flex flex-col justify-center items-center'
            onClick={()=>{
                setMorning(new Date(morning.getTime()-(-86400000)))
            }}
        >
            <ArrowBigRight/>
        </button>
    </div>
  )
}

export default DayCard