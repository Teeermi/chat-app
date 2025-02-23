"use client";

import { Button } from "@/components/ui/button";
import { handleLogout } from "@/lib/actions";

export function SignOut() {
  return (
    <form action={handleLogout}>
      <Button variant="destructive" className="mr-2 ml-2">
        Log out
      </Button>
    </form>
  );
}
