'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

const BackLink = () => {
    const router = useRouter()
  return (
    <button 
        onClick = {()=>router.back()}
        className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}">
        Zpět
    </button>
  )
}

export default BackLink