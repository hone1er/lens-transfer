"use client";
import Cooldown from "@/components/composed/Cooldown";
import DisableGuardian from "@/components/composed/DisableGuardian";
import EnableGuardian from "@/components/composed/EnableGuardian";
import { LensProfiles } from "@/components/composed/LensProfiles";
import { LensTransfer } from "@/components/composed/LensTransfer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SessionType,
  useLogout,
  useProfiles,
  useProfilesManaged,
  useSession,
} from "@lens-protocol/react-web";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import React, { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { TransferSelection } from "./LensProfileManager";

const LensTransferManager = () => {
  const { address } = useAccount();
  const { data: profiles } = useProfilesManaged({
    for: address as string,
  });
  const [transferSelection, setTransferSelection] =
    React.useState<TransferSelection>(TransferSelection.Handle);

  const { execute: executeLogout } = useLogout();
  const { open } = useWeb3Modal();

  const { disconnect } = useDisconnect();
  const { data: session, loading } = useSession();

  const sessionProfile = profiles?.find(
    (profile) =>
      session?.type === SessionType.WithProfile &&
      profile.id === session?.profile?.id,
  );

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
            <CardTitle className="text-xl font-bold">
              Profile Transfers
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <h3 className="text-lg font-normal ">
              Transferring your profile is a multi-step process. Please follow
              the steps below to transfer your profile to a new address.
            </h3>
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
              note: your guardian was returned as &quot;NULL&quot; by the Lens
              API. Logout and login again to interact with your guardian.
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
        </div>
      </div>
    </>
  );
};

export default LensTransferManager;
