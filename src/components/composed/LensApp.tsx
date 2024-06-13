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
import Link from "next/link";
import { Tip } from "./Tip";
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
              <CardTitle className="text-xl font-bold">Next Steps...</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  {" "}
                  1. Disable the Guardian (this will disable the guardian for
                  all profiles owned by the connected wallet)
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
                note: if you don&apos;t see any profiles below, we did not
                detect them in your connected wallet. Please connect a different
                address and try again.
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

            {session?.authenticated ? <Delegation session={session} /> : null}
          </div>
        </div>
        <footer className="bg-gray-100 py-8 dark:bg-gray-950">
          <div className="container mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-200">
              <Link
                className="flex items-center gap-2"
                href="https://github.com/hone1er/lens-transfer"
                target="_blank"
                prefetch={false}
              >
                <GithubIcon className="h-5 w-5" />
                <span className="text-sm">View the code on GitHub</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <Link
                className="flex items-center gap-2"
                target="_blank"
                href="https://www.lens.xyz/docs"
                prefetch={false}
              >
                <svg
                  viewBox="0 0 44 29"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M29.8889 9.06558C29.7188 9.23851 29.4385 9.12011 29.4385 8.87751C29.4385 8.65607 29.4385 8.41187 29.428 8.18133C29.1658 -1.39378 14.8334 -1.39378 14.5712 8.18133C14.5652 8.41187 14.5622 8.64393 14.5622 8.87751C14.5622 9.11174 14.2776 9.231 14.1118 9.06558C13.9491 8.90329 13.7804 8.73797 13.6146 8.58023C6.69848 1.99611 -3.42947 12.2082 3.10858 19.1564C3.26726 19.3242 3.42845 19.4911 3.59215 19.6569C11.4808 27.5993 21.9978 27.6 21.9996 27.6C21.9996 27.6 21.9997 27.6 21.9996 27.6C22.0014 27.6 32.5199 27.5993 40.4086 19.6569C40.5733 19.4921 40.7345 19.3252 40.8921 19.1564C47.4302 12.2007 37.2962 1.99611 30.3861 8.58023C30.2189 8.73797 30.0486 8.90026 29.8889 9.06558Z"
                    stroke-width="1.65481"
                    stroke-miterlimit="10"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.0929 16.2621C27.8709 16.2621 27.7942 16.5849 27.9357 16.7559C28.1863 17.0586 28.337 17.448 28.337 17.8729C28.337 18.837 27.5607 19.6186 26.6031 19.6186C25.6454 19.6186 24.8691 18.837 24.8691 17.8729C24.8691 17.8213 24.8023 17.7957 24.7721 17.8375C24.4987 18.2156 24.3141 18.6401 24.2383 19.0859C24.1956 19.3369 23.993 19.5447 23.7384 19.5447H23.5977C23.2653 19.5447 22.9911 19.2734 23.0402 18.9447C23.3764 16.6923 25.5814 15.0586 28.0929 15.0586C30.6044 15.0586 32.8094 16.6923 33.1457 18.9447C33.1947 19.2734 32.9206 19.5447 32.5882 19.5447C32.2559 19.5447 31.9927 19.2721 31.9205 18.9477C31.5917 17.4712 30.0678 16.2621 28.0929 16.2621ZM12.6953 17.8729C12.6953 17.8049 12.6077 17.7684 12.5665 17.8225C12.2742 18.2065 12.0751 18.6414 11.9908 19.0998C11.9411 19.3705 11.7224 19.5955 11.4471 19.5955H11.3437C11.0114 19.5955 10.7372 19.3242 10.7862 18.9955C11.1223 16.7418 13.3275 15.1094 15.839 15.1094C18.3505 15.1094 20.5557 16.7418 20.8918 18.9955C20.9408 19.3242 20.6666 19.5955 20.3343 19.5955C20.002 19.5955 19.7388 19.3229 19.6666 18.9985C19.3381 17.5211 17.8142 16.3129 15.839 16.3129C15.6594 16.3129 15.5936 16.5669 15.7139 16.7004C15.9931 17.0102 16.1632 17.4216 16.1632 17.8729C16.1632 18.837 15.3869 19.6186 14.4292 19.6186C13.4716 19.6186 12.6953 18.837 12.6953 17.8729ZM24.8181 21.8928C24.5264 21.7334 24.1634 21.8477 23.9286 22.0828C23.4758 22.536 22.7894 22.8457 21.995 22.8457C21.1985 22.8457 20.5129 22.5391 20.0611 22.0856C19.8265 21.8502 19.4641 21.7345 19.1719 21.8928C18.8797 22.0511 18.7677 22.4207 18.9771 22.6788C19.6625 23.5234 20.7733 24.0492 21.995 24.0492C23.2174 24.0492 24.3257 23.5179 25.0102 22.6795C25.2204 22.422 25.1097 22.0521 24.8181 21.8928Z"
                    fill="#fff"
                  ></path>
                </svg>
                <span className="text-sm">Lens Documentation</span>
              </Link>
            </div>
            <Tip />
          </div>
        </footer>
      </>
    );
  }
}

function GithubIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
