"use client";
import {SignIn} from "@/components/sign-in";

import { Input } from "@/components/ui/input"
import {ModeToggle} from "@/components/mode";
import { Button } from "@/components/ui/button"

import Form from "next/form";
import {useEffect, useState} from "react";
import {getSession, moveToRoom} from "@/lib/actions";
import { Session } from "next-auth";
import UserProfile from "@/components/UserProfile";



export default function Home() {
const [session, setSession] = useState<Session | null>(null);

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
                <Button type="submit">Move</Button>
            </Form>

        <UserProfile session={session} />
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
