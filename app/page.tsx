"use client";
import { SignIn } from "@/components/sign-in";

import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode";
import { Button } from "@/components/ui/button";

import Form from "next/form";
import { useEffect, useState } from "react";
import { getSession, moveToRoom } from "@/lib/actions";
import { Session } from "next-auth";
import UserProfile from "@/components/UserProfile";

import Loader from "@/components/loading";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await getSession();
      setSession(response);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;

  if (session) {
    return (
      <div className="mainWrapper flex flex-col items-center ">
        <Form
          action={moveToRoom}
          className="flex gap-2 flex-col justify-center items-center"
        >
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Enter a room
          </h2>
          <div className="flex  ">
            <Input type="number" max={999} placeholder="Code" name="code" />
            <Button type="submit">Move</Button>
          </div>
        </Form>

        <UserProfile session={session} />
      </div>
    );
  } else {
    return (
      <main className="flex gap-2">
        <SignIn />
        <ModeToggle />
      </main>
    );
  }
}
