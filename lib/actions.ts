"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function handleLogin() {
  await signIn("github");
}

export async function handleLogout() {
  await signOut();
}

export async function getSession() {
  return await auth();
}

export async function moveToRoom(formData: FormData) {
  const code = formData.get("code") as string;

  redirect(`/room/${code}`);
}
