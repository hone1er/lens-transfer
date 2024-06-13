"use client";
import { Delegation } from "./Delegation";
import React, { useEffect } from "react";
import { LensProfiles } from "./LensProfiles";
import DisableGuardian from "./DisableGuardian";
import {
  SessionType,
  useLogout,
  useProfiles,
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
import Cooldown from "./Cooldown";
import { LensTransfer } from "./LensTransfer";
import EnableGuardian from "./EnableGuardian";
export enum TransferSelection {
  Profile,
  Handle,
}
export function LensApp() {
  const { address } = useAccount();
  const { data: profiles } = useProfiles({
    where: {
      ownedBy: [address as string],
    },
  });
  const [transferSelection, setTransferSelection] =
    React.useState<TransferSelection>(TransferSelection.Handle);

  const { execute: executeLogout } = useLogout();
  const { open } = useWeb3Modal();

  const { disconnect } = useDisconnect();
  const { data: session, loading } = useSession();
  console.log("🚀 ~ LensApp ~ session:", session);

  const sessionProfile = profiles?.find(
    (profile) =>
      session?.type === SessionType.WithProfile &&
      profile.id === session?.profile?.id,
  );

  console.log("🚀 ~ LensApp ~ sessionProfile:", sessionProfile);
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
            <CardTitle className="text-xl font-bold">Next Steps...</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-gray-500 dark:text-gray-400">
              <li>
                {" "}
                1. Disable the Guardian (this will disable the guardian for all
                profiles owned by the connected wallet)
              </li>
              <li> 2. Wait 7 days for the cooldown period to end</li>
              <li> 3. Transfer ownership to the new address:</li>
              <ul className="space-y-2">
                <li className="ml-6 text-sm">
                  3a. (optional) Add the wallet you want to use for Lens
                  interactions as a profile manager
                </li>
                <li className="ml-6 text-sm">3b. Transfer Profile NFT</li>
                <li className="ml-6 text-sm">3b. Transfer Handle NFT</li>
              </ul>
            </ol>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              note: if you don&apos;t see any profiles below, we did not detect
              them in your connected wallet. Please connect a different address
              and try again.
            </p>
          </CardFooter>
        </Card>
        {profiles && profiles?.length > 0 ? <LensProfiles /> : null}

        <div className="flex w-full flex-col gap-4">
          {transferSelection === TransferSelection.Profile &&
          session?.type === SessionType.WithProfile ? (
            <div className="flex w-full flex-row gap-4">
              <DisableGuardian
                isDisabled={
                  !session.profile.guardian?.protected ||
                  session.profile.guardian === null
                }
              />
              <EnableGuardian
                isDisabled={
                  session.profile.guardian === null ||
                  session.profile.guardian?.protected
                }
              />
            </div>
          ) : null}
          {transferSelection === TransferSelection.Profile &&
          session?.type === SessionType.WithProfile &&
          session.profile.guardian === null ? (
            <p className="text-gray-500 dark:text-gray-400">
              note: your guardian is was returned as NULL by the Lens API.
              Logout and login again to interact with your guardian
            </p>
          ) : null}

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-2">
            {session?.authenticated ? (
              <LensTransfer
                setTransferSelection={(selection) =>
                  setTransferSelection(selection)
                }
                transferSelection={transferSelection}
                disabled={profiles?.length === 0}
                profile={sessionProfile!}
              />
            ) : null}
            {session?.type === SessionType.WithProfile &&
            transferSelection === TransferSelection.Profile ? (
              <Cooldown
                endsOn={
                  session?.profile?.guardian
                    ? session.profile.guardian.cooldownEndsOn
                    : null
                }
              />
            ) : null}
          </div>

          {session?.authenticated ? <Delegation session={session} /> : null}
        </div>
      </div>
    );
  }
}
