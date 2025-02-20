import {SignOut} from "@/components/sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {ModeToggle} from "@/components/mode";


import { Session } from "next-auth";

export default function UserProfile({ session }: { session: Session }) {

    return (
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
    )
}