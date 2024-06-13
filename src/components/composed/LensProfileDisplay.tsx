"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useFollow, useProfile } from "@lens-protocol/react-web";
export function LensProfileDisplay() {
  const { data, loading } = useProfile({
    forHandle: "lens/hone1er",
  });
  const { execute } = useFollow();
  const handleFollow = async () => {
    if (!data) return;
    await execute({ profile: data });
  };
  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-950">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://ik.imagekit.io/lens/media-snapshot/3986968c836357ca1fff03bf9318bfcfa694c49b72240ea31e0afd665fec5a5c.jpg" />
          <AvatarFallback>H1</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold">Hone1er</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Web3 Engineer
          </p>
        </div>
        <Button
          onClick={() => handleFollow()}
          disabled={loading}
          variant="outline"
          className="ml-auto"
        >
          Follow
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Hone1er is a web3 engineer with a passion for building decentralized
        applications and exploring the latest in blockchain technology. Follow
        on Lens for more updates!
      </p>
    </div>
  );
}
