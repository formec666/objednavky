import Navbar from "./navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  
  let isAdmin = false;
  if (session && session.user?.email){
    const user = await prisma?.user.findUnique({where: {email: session.user?.email}});
    if (user){
      isAdmin = user.isAdmin;
    }
  }
  return <Navbar session={session} isAdmin = {isAdmin}/>;
}
