"use client";
import React from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "../ui/button";
import { SessionType, useSession } from "@lens-protocol/react-web";
const DisableGuardian = ({ isDisabled = false }: { isDisabled?: boolean }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const { writeContractAsync } = useWriteContract();
  const [hash, setHash] = React.useState<string | null>(null);
  const result = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
  });
  const handleWriteContract = async () => {
    setLoading(true);
    try {
      await writeContractAsync(
        {
          abi: [
            {
              constant: false,
              inputs: [],
              name: "DANGER__disableTokenGuardian",
              outputs: [],
              payable: false,
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          address: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
          functionName: "DANGER__disableTokenGuardian",
        },
        {
          onSettled: (result) => {
            setHash(result as string);
          },
        },
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      disabled={
        loading ||
        (session?.type === SessionType.WithProfile &&
          !session?.profile.guardian?.protected &&
          session?.profile?.guardian !== null) ||
        isDisabled
      }
      onClick={async () => {
        await handleWriteContract();
      }}
    >
      Disable Guardian
    </Button>
  );
};

export default DisableGuardian;
