/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  type ProfileId,
  useLogin,
  useLogout,
  useSession,
} from "@lens-protocol/react-web";
import { useAccount } from "wagmi";

export default function LensProfileLoginButton({
  selectedProfileId,
}: {
  readonly selectedProfileId: string;
}) {
  const { address } = useAccount();

  const { data: session } = useSession();

  const { execute: executeLogin } = useLogin();
  const { execute: executeLogout } = useLogout();

  async function handleLogin() {
    await executeLogin({
      address: address as string,
      profileId: `${selectedProfileId}` as ProfileId,
    });
  }

  async function handleLogout() {
    await executeLogout();
  }

  return (
    <Button
      onClick={() => {
        session?.authenticated ? void handleLogout() : void handleLogin();
      }}
      size="lg"
      variant="outline"
      className="min-w-[140px] place-self-end text-black"
    >
      {session?.authenticated ? "Logout" : "Login"}
    </Button>
  );
}
