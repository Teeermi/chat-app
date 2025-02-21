"use client";

import {useParams} from "next/navigation";
import { io } from "socket.io-client";
import Form from 'next/form'
import { useEffect, useRef, useState } from "react";
import { getSession } from "@/lib/actions";
import { Session } from "next-auth";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfile from "@/components/UserProfile";


 const socket = io("http://localhost:3000");

export default function Page() {
    const params = useParams();
   



    const [session, setSession] = useState<Session | null>(null);
    const [fetchedMessages, setFetchedMessages] = useState<{ user: string, message: string }[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);


useEffect(() => {

    async function fetchData() {
        const response = await getSession();

        setSession(response);
    }

    fetchData();

    socket.emit("joinRoom", params.code);



    socket.on("reciveMessages", (message) => { 
      setFetchedMessages(message.messages);
    });
 
    
    
  }, [params.code]);


   useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fetchedMessages]);


  function handleSendMessage(formData: FormData) {
    const message = formData.get("message");



    socket.emit("sendMessage", { roomId: params.code, message, user: session?.user?.name });

    

  }


    
    return (
        <div className="roomWrapper w-full h-full flex flex-col items-center pb-9">
            <div className="wrapperV2 w-full h-full flex flex-col items-center justify-center">
                <h2 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight mt-0">
                    Room {params.code}
                </h2>

                <div className="messageContainer w-2/5 h-[30rem] flex flex-col justify-between">
                    <ScrollArea className="userMessage w-full h-[20rem]">
                        {fetchedMessages.map((message, index) => {
                    
                            if (message.user === session?.user?.name) {
                                return (
                                    <div  key={index} className="rightSide flex justify-end mb-2 ">
                                        <span className="bg-secondary p-2 break-words overflow-hidden text-ellipsis">
                                            {message.message}
                                        </span>
                                    </div>
                                );
                            }

                            return <p key={index}>{message.message}</p>;
                        })}

                            



                        <div ref={bottomRef} />
                    </ScrollArea>

                    <Form action={handleSendMessage} className="grid w-full gap-2">
                        <Textarea placeholder="Type your message here." name="message" />
                        <Button>Send message</Button>
                    </Form>
                </div>
            </div>

            {session && <UserProfile session={session} />}
        </div>
    );
}