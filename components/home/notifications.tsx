import { Notification } from '@prisma/client'
import { AlertTriangle, AlertTriangleIcon } from 'lucide-react'
import React from 'react'

const Notifications = (props:{notifications: Notification[]}) => {
  return (<>
    {props.notifications.map((notification: Notification)=>(
        <div key={notification.body} className='bg-red-400 p-4 text-lg font-semibold border-2 flex flex-row w-full rounded-lg'>
            <AlertTriangle/>
            <div className='pl-4'>
                {notification.body}
            </div>
            {notification.link&&
            <a href={'https://'+notification.link} className='pl-2'>
                {' '+notification.link}
            </a>
            }
            
        </div>
    ))}</>
  )
}

export default Notifications