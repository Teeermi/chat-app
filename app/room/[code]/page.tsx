"use client";

import { notFound, useParams } from "next/navigation";
import { io } from "socket.io-client";
import Form from "next/form";
import { useEffect, useRef, useState } from "react";
import { getSession } from "@/lib/actions";
import { Session } from "next-auth";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfile from "@/components/UserProfile";
import Loader from "@/components/loading";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CornerDownLeft, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const socket = io("http://192.168.0.52:3000");

export default function Page() {
  const params = useParams();
  const [session, setSession] = useState<Session | null>(null);
  const [fetchedMessages, setFetchedMessages] = useState<
    {
      user: string;
      message: string;
      image: string | undefined;
      date: string;
      fileInfo: { filePath: string; fileType: string; fileName: string };
    }[]
  >([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await getSession();
      setSession(response);
      socket.emit("joinRoom", params.code);
      socket.on("reciveMessages", (message) => {
        if (!message || message.messages.length === 0) {
          setFetchedMessages([]);
        } else {
          setFetchedMessages(message.messages);
        }
        setLoading(false);
      });
    }
    fetchData();
  }, [params.code]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fetchedMessages]);

  async function handleSendMessage(formData: FormData) {
    const message = formData.get("message");

    const file = formData.get("file") as File;

    if (!file.name) {
      socket.emit("sendMessage", {
        roomId: params.code,
        message,
        user: session?.user?.name,
        image: session?.user?.image,
        date: new Date(),
        fileInfo: { filePath: "", fileType: "", fileName: "" },
      });
      return;
    }

    if (file) {
      console.log(file);
      const response = await fetch(`/api/upload/${params.code}`, {
        method: "POST",
        headers: {
          "X-File-Name": file.name,
          "Content-Type": "application/octet-stream",
        },
        body: file,
      });

      if (response.ok) {
        socket.emit("sendMessage", {
          roomId: params.code,
          message,
          user: session?.user?.name,
          image: session?.user?.image,
          date: new Date(),
          fileInfo: {
            filePath: `/${params.code}/${file.name}`,
            fileType: file.type,
            fileName: file.name,
          },
        });
        return;
      }
    }

    socket.emit("sendMessage", {
      roomId: params.code,
      message,
      user: session?.user?.name,
      image: session?.user?.image,
      date: new Date(),
    });
  }

  if (loading) return <Loader />;
  if (!session) return notFound();
  if ((params.code ?? "").length > 3) return notFound();
  function handleDownloadClick(path: string) {
    const fileUrl = `${window.location.origin}/${path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", path);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="roomWrapper w-full h-full flex flex-col items-center pb-9 ">
      <div className="wrapperV2 w-full h-full flex flex-col items-center justify-center">
        <div className="flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="icon">
              <CornerDownLeft />
            </Button>
          </Link>

          <h2 className="scroll-m-20 text- text-3xl font-semibold tracking-tight mt-0">
            Room {params.code}
          </h2>
        </div>

        <div className="messageContainer w-2/5 h-[30rem] flex flex-col justify-between">
          <ScrollArea className="userMessage w-full h-[30rem]">
            {fetchedMessages.map((message, index) => {
              console.log(message);
              if (message.user === session?.user?.name) {
                if (message.fileInfo.filePath) {
                  if (message.fileInfo.fileType.includes("image")) {
                    return (
                      <div
                        key={index}
                        className="rightSide flex justify-end mb-2 "
                      >
                        <div className="containerUser flex mr-4 gap-2">
                          <div className="textContainer">
                            <h1 className="text-right font-normal text-[0.7rem] mb-2 text-muted-foreground ">
                              {session?.user?.name}
                            </h1>

                            <h2 className=" bg-muted-foreground text-right rounded-b-lg mb-3 rounded-tl-lg max-w-72 dark:bg-secondary p-2 break-words overflow-hidden text-ellipsis">
                              {message.message}
                              <Image
                                width="176"
                                height="176"
                                src={message.fileInfo.filePath}
                                alt=""
                                className="w-44 h-44 mt-2"
                              />
                            </h2>
                          </div>
                          <Image
                            width="176"
                            height="176"
                            src={session.user?.image ?? ""}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className="rightSide flex justify-end mb-2 "
                      >
                        <div className="containerUser flex mr-4 gap-2">
                          <div className="textContainer">
                            <h1 className="text-right font-normal text-[0.7rem] mb-2 text-muted-foreground ">
                              {session?.user?.name}
                            </h1>

                            <h2 className=" bg-muted-foreground rounded-b-lg mb-3 text-right rounded-tl-lg max-w-72 dark:bg-secondary p-2 break-words overflow-hidden text-ellipsis">
                              {message.message}

                              {message.message ? <br /> : ""}

                              <HoverCard>
                                <HoverCardTrigger>
                                  <button
                                    className="hover:underline text-left"
                                    onClick={() => {
                                      handleDownloadClick(
                                        message.fileInfo.filePath
                                      );
                                    }}
                                  >
                                    {message.fileInfo.fileName}
                                  </button>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                  <Download className="mb-2" /> Click to
                                  download the file
                                </HoverCardContent>
                              </HoverCard>
                            </h2>
                          </div>
                          <Image
                            width="176"
                            height="176"
                            src={session.user?.image ?? ""}
                            alt=""
                            className="w-8 h-8 rounded-full mt-2"
                          />
                        </div>
                      </div>
                    );
                  }
                }

                return (
                  <div key={index} className="rightSide flex justify-end mb-2 ">
                    <div className="containerUser flex mr-4 gap-2">
                      <div className="textContainer">
                        <h1 className="text-right font-normal text-[0.7rem] mb-2 text-muted-foreground ">
                          {session?.user?.name}
                        </h1>

                        <h2 className=" bg-muted-foreground rounded-b-lg mb-3 rounded-tl-lg max-w-72 dark:bg-secondary p-2 break-words overflow-hidden text-ellipsis">
                          {message.message}
                        </h2>
                      </div>
                      <Image
                        width="176"
                        height="176"
                        src={session.user?.image ?? ""}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  </div>
                );
              }

              if (message.fileInfo.filePath) {
                if (message.fileInfo.fileType.includes("image")) {
                  return (
                    <div
                      key={index}
                      className="rightSide flex justify-start mb-2 "
                    >
                      <div className="containerUser flex ml-4 gap-2">
                        <Image
                          width="176"
                          height="176"
                          src={message.image ?? ""}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="textContainer">
                          <h1 className="text-left font-normal text-[0.7rem] mb-2 text-muted-foreground ">
                            {message.user}
                          </h1>

                          <h2 className=" bg-muted-foreground text-right rounded-b-lg mb-3 rounded-tr-lg max-w-72 dark:bg-secondary p-2 break-words overflow-hidden text-ellipsis">
                            {message.message}
                            <Image
                              width="176"
                              height="176"
                              src={message.fileInfo.filePath}
                              alt=""
                              className="w-44 h-44 mt-2"
                            />
                          </h2>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="rightSide flex justify-start mb-2 "
                    >
                      <div className="containerUser flex mr-4 gap-2">
                        <Image
                          width="176"
                          height="176"
                          src={message.image ?? ""}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="textContainer">
                          <h1 className="text-left font-normal text-[0.7rem] mb-2 text-muted-foreground ">
                            {message.user}
                          </h1>

                          <h2 className=" bg-muted-foreground rounded-b-lg mb-3 rounded-tr-lg max-w-72 dark:bg-secondary p-2 break-words overflow-hidden text-ellipsis">
                            {message.message}

                            {message.message ? <br /> : ""}

                            <HoverCard>
                              <HoverCardTrigger>
                                <button
                                  className="hover:underline"
                                  onClick={() => {
                                    handleDownloadClick(
                                      message.fileInfo.filePath
                                    );
                                  }}
                                >
                                  {message.fileInfo.fileName}
                                </button>
                              </HoverCardTrigger>
                              <HoverCardContent>
                                <Download className="mb-2" /> Click to download
                                the file
                              </HoverCardContent>
                            </HoverCard>
                          </h2>
                        </div>
                      </div>
                    </div>
                  );
                }
              }

              return (
                <div key={index} className="rightSide flex justify-start mb-2 ">
                  <div className="containerUser flex mr-4 gap-2">
                    <Image
                      width="176"
                      height="176"
                      src={message.image ?? ""}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="textContainer">
                      <h1 className="text-left font-normal text-[0.7rem] mb-2 text-muted-foreground ">
                        {message.user}
                      </h1>

                      <h2 className=" bg-muted-foreground rounded-b-lg mb-3 rounded-tr-lg max-w-72 dark:bg-secondary p-2 break-words overflow-hidden text-ellipsis">
                        {message.message}
                      </h2>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </ScrollArea>

          <Form action={handleSendMessage} className="grid w-full gap-2">
            <Textarea placeholder="Type your message here." name="message" />
            <Input id="picture" name="file" type="file" />
            <Button>Send message</Button>
          </Form>
        </div>
      </div>

      {session && <UserProfile session={session} />}
    </div>
  );
}
