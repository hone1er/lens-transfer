/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import { SessionType, useSession, useProfiles } from "@lens-protocol/react-web";
import React from "react";
import { useAccount } from "wagmi";
import LensProfileCard from "./LensProfileCard";

export function LensProfiles() {
  const { address } = useAccount();
  const { data: session, loading } = useSession();

  const { data: profiles } = useProfiles({
    where: {
      ownedBy: [address as string],
    },
  });
  // if the user is logged in only show the profile they are logged in with
  const profileObj = profiles?.find((profile) => {
    if (session?.type !== SessionType.WithProfile) return false;
    return profile.id === session?.profile?.id;
  });

  if (loading) return <div>Loading...</div>;
  let content;
  if (profiles?.length && !profileObj) {
    content = (
      <>
        <h2 className="text-lg font-semibold">Login to a profile</h2>
        {profiles?.map((profile) => (
          <LensProfileCard
            profile={profile}
            key={profile.id}
            session={session}
          />
        ))}
      </>
    );
  } else if (profileObj) {
    content = <LensProfileCard profile={profileObj} session={session} />;
  } else {
    content = <div>No profiles found</div>;
  }

  return <div className="flex flex-col gap-6">{content}</div>;
}
