"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { handleLogin } from "@/lib/actions";

export function SignIn() {
  return (
    <form action={handleLogin}>
      <Button>
        <LogIn /> Login to app
      </Button>
    </form>
  );
}
