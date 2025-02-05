"use client";
import {SignIn} from "@/components/sign-in";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {ModeToggle} from "@/components/mode";
import { Button } from "@/components/ui/button"
import {SignOut} from "@/components/sign-out";
import Form from "next/form";
import {useEffect, useState} from "react";
import {getSession, moveToRoom} from "@/lib/actions";


export default function Home() {
const [session, setSession] = useState(null);


    useEffect(() => {
        async function fetchData() {
            const response = await getSession();
            setSession(response);
        }
        fetchData();
    }, []);





  if (session) {
    return (
        <div className="mainWrapper flex flex-col items-center mb-[-20rem] ">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Enter a room
            </h2>


            <Form action={moveToRoom} className="flex gap-2 mb-[25rem]" >
                <Input type="number" placeholder="Code" name="code"/>
                <Button type="submit">Subscribe</Button>
            </Form>

        <div className="userProfile flex gap-1 justify-center items-center  ">
            <Avatar>
                <AvatarImage src={`${session?.user?.image}`} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="userProfileText">
                <small className="text-sm font-medium leading-none">{session?.user?.name}</small>

                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>

            </div>

            <SignOut />

            <ModeToggle />
        </div>
        </div>
    )




  } else  {
    return (
        <main className="flex gap-2" >
          <SignIn />
          <ModeToggle />
        </main>
    );
  }





}
