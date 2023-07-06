'use client'
import Card from "@/components/home/card";
import Modal from "@/components/shared/modal";
import Popover from "@/components/shared/popover";
import { User } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const UserGrid = (props: {users:User[], handleClick?:string})=>{
    const [users, setUsers] = useState(props.users);
    
    const [search, setSearch] = useState('');

    const findUser = (user:User, search: string) =>{
        return user.name?.includes(search) || user.email?.includes(search);
    }

    useEffect(() => {
      if (search != ''){
        setUsers(props.users.filter(user=>findUser(user, search)))
      }
      else{
        setUsers(props.users);
      }
    }, [search])
    
    return (<>
        <input
            value={search}
            onChange={(e:any)=>setSearch(e.target.value)}
            className="flex h-10 w-full p-2 m-2 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}"
        />
        <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0" key={JSON.stringify(props.users)}>
            {users.map((user:User, index)=>(
                <UserCard user={user} key={user.id} handleClick={props.handleClick}/>
            ))}
            </div></>
    )
}

const UserCard = (props: {user: User, handleClick?: string})=>{
    if (props.handleClick !== undefined){
        return(
            <Link href={props.handleClick + '/' + props.user.id}>
                <Card
                    demo = {<UserIcon/>}
                    key={props.user.id}
                    title={props.user.name||'Jméno a příjmení'}
                    description={props.user.email||'email'}

                />
            </Link>
        )
    }

    return(
    
    
        <Link href={`/users/${props.user.id}`}>
            <Card
                demo = {<UserIcon/>}
                key={props.user.id}
                title={props.user.name||'Jméno a příjmení'}
                description={props.user.email||'email'}

            />
        </Link>
    
    )
}

