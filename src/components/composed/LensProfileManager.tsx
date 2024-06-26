"use client";

import { Delegation } from "./Delegation";
import React, { useEffect } from "react";
import { LensProfiles } from "./LensProfiles";
import {
  SessionType,
  useLogout,
  useProfilesManaged,
  useSession,
} from "@lens-protocol/react-web";
import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

export enum TransferSelection {
  Profile,
  Handle,
}
export function LensProfileManager() {
  const { address } = useAccount();
  const { data: profiles } = useProfilesManaged({
    for: address as string,
  });

  const { execute: executeLogout } = useLogout();
  const { open } = useWeb3Modal();

  const { disconnect } = useDisconnect();
  const { data: session, loading } = useSession();

  useEffect(() => {
    async function checkStatus() {
      if (
        session?.type === SessionType.WithProfile &&
        session?.address &&
        address &&
        address !== session?.address
      ) {
        await executeLogout();
      }
    }
    void checkStatus();
  }, [address, session, executeLogout, session?.type]);
  if (loading) return <div>Loading...</div>;

  if ((!session?.authenticated && !address) || !address) {
    return (
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => open()}
          size={"sm"}
          className="max-w-60 place-self-end"
        >
          Connect Wallet
        </Button>
        <Card className="border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Lens Profile Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400">
              Simple tool to help users transfer their Lens profile to a new
              address.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Connect your wallet to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    address ??
    (session?.type === SessionType.WithProfile &&
      session?.profile?.guardian === null) ??
    (session?.type === SessionType.WithProfile &&
      session?.profile?.guardian?.protected === false)
  ) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => disconnect()}
            size={"sm"}
            className="max-w-60 place-self-end"
          >
            Disconnect Wallet
          </Button>
          <Card className="border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="font-boepsld text-xl">
                Profile Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <h3 className="text-lg font-normal ">
                Here you can manage which address have permission to login and
                post from your profile
              </h3>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                note: if you don&apos;t see any profiles below, we did not
                detect them in your connected wallet. Please connect a different
                address and try again.
              </p>
            </CardFooter>
          </Card>
          {profiles && profiles?.length > 0 ? <LensProfiles /> : null}

          <div className="flex w-full flex-col gap-4">
            {session?.authenticated ? <Delegation session={session} /> : null}
          </div>
        </div>
      </>
    );
  }
}
