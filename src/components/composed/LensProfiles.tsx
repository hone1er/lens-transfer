/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import {
  type Profile,
  SessionType,
  useSession,
} from "@lens-protocol/react-web";
import React from "react";
import { useProfiles } from "@lens-protocol/react-web";
import { useAccount } from "wagmi";
import Image from "next/image";
import LensProfileLoginButton from "./LensLogin";

export function LensProfiles() {
  const { address } = useAccount();
  const { data: session, loading } = useSession();

  const { data: profiles } = useProfiles({
    where: {
      ownedBy: [address as string],
    },
  });

  const profileObjs = profiles?.filter((profile) => {
    if (session?.type !== SessionType.WithProfile) return false;
    return profile.id === session?.profile?.id;
  });

  if (loading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col gap-6">
      {profiles?.length && !profileObjs?.length ? (
        <>
          <h2 className="text-lg font-semibold">
            Select a profile to transfer
          </h2>
          {profiles?.map((profile) => (
            <Profile profile={profile} key={profile.id} />
          ))}
        </>
      ) : profileObjs && profileObjs?.length > 0 ? (
        <Profile profile={profileObjs[0]!} />
      ) : (
        <div>No profiles found</div>
      )}
    </div>
  );

  function Profile({ profile }: { profile: Profile }): React.JSX.Element {
    return (
      <div
        key={profile.id}
        className={`flex items-center justify-between rounded-lg bg-white p-4 shadow-md  dark:bg-gray-800 ${session?.type === SessionType.WithProfile && session?.profile?.id === profile.id ? "border border-indigo-500" : ""}`}
      >
        <div className="flex items-center">
          <div className="relative flex h-16 w-16 items-center">
            <Image
              className="h-12 w-12 rounded-full"
              src={
                profile.metadata?.picture?.__typename === "ImageSet"
                  ? profile.metadata.picture.optimized?.uri ?? ""
                  : profile.metadata?.picture?.image.optimized?.uri ?? ""
              }
              alt=""
              fill
            />
          </div>{" "}
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {profile.handle?.fullHandle}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.id}
            </p>
          </div>
        </div>
        <LensProfileLoginButton selectedProfileId={profile.id} />
      </div>
    );
  }
}
